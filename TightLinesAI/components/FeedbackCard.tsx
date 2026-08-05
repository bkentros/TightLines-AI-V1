import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { paper, paperFonts, paperRadius, paperSpacing } from '../lib/theme';
import type { FeedbackSentiment, FeedbackTopic } from '../lib/feedback';
import type { useAuthStore } from '../store/authStore';

type Profile = ReturnType<typeof useAuthStore.getState>['profile'];
type User = ReturnType<typeof useAuthStore.getState>['user'];

type FeedbackCardProps = {
  featureName: string;
  topic: FeedbackTopic;
  contextLines?: string[];
  profile?: Profile;
  user?: User;
  compact?: boolean;
  variant?: 'feedback' | 'request';
  eyebrow?: string;
  title?: string;
  body?: string;
  actionLabel?: string;
};

export function FeedbackCard({
  featureName,
  topic,
  contextLines = [],
  profile,
  user,
  compact = false,
  variant = 'feedback',
  eyebrow,
  title,
  body,
  actionLabel,
}: FeedbackCardProps) {
  const router = useRouter();
  const handlePress = (sentiment: FeedbackSentiment) => {
    router.push({
      pathname: '/support',
      params: {
        topic,
        sentiment,
        featureName,
        requestMode: variant === 'request' ? 'true' : undefined,
        contextLines: JSON.stringify([
          `Feature: ${featureName}`,
          profile?.username ? `Username: @${profile.username}` : null,
          user?.email ? `Email: ${user.email}` : null,
          ...contextLines,
        ].filter(Boolean)),
      },
    });
  };

  if (variant === 'request') {
    if (compact) {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.miniRequestCard,
            pressed && styles.requestButtonPressed,
          ]}
          onPress={() => handlePress('note')}
          accessibilityRole="button"
          accessibilityLabel={actionLabel ?? 'Request coverage'}
        >
          <View style={[styles.iconBadge, styles.requestIconBadge, styles.miniRequestIcon]}>
            <Ionicons name="map-outline" size={14} color={paper.redDk} />
          </View>
          <View style={styles.miniRequestCopy}>
            <Text style={[styles.eyebrow, styles.requestEyebrow]}>
              {eyebrow ?? 'REQUEST COVERAGE'}
            </Text>
            <Text style={styles.miniRequestTitle} numberOfLines={1}>
              {title ?? 'What should FinFindr add next?'}
            </Text>
          </View>
          <Text style={styles.miniRequestAction} numberOfLines={1}>
            {(actionLabel ?? 'SEND A REQUEST').toUpperCase()}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={paper.redDk} />
        </Pressable>
      );
    }

    return (
      <View style={[styles.card, styles.requestCard]}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBadge, styles.requestIconBadge]}>
            <Ionicons name="map-outline" size={16} color={paper.redDk} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.eyebrow, styles.requestEyebrow]}>
              {eyebrow ?? 'REQUEST COVERAGE'}
            </Text>
            <Text style={styles.requestTitle}>
              {title ?? 'What should FinFindr add next?'}
            </Text>
          </View>
        </View>
        {body ? <Text style={styles.requestBody}>{body}</Text> : null}
        <Pressable
          style={({ pressed }) => [
            styles.requestButton,
            pressed && styles.requestButtonPressed,
          ]}
          onPress={() => handlePress('note')}
          accessibilityRole="button"
        >
          <Text style={styles.requestButtonText}>
            {(actionLabel ?? 'SEND A REQUEST').toUpperCase()}
          </Text>
          <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="chatbubble-ellipses-outline" size={15} color={paper.dashboardBlue} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>FEEDBACK</Text>
          <Text style={styles.title}>How did this read?</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <FeedbackButton
          icon="checkmark-circle-outline"
          label="Looks right"
          onPress={() => handlePress('looks_right')}
        />
        <FeedbackButton
          icon="alert-circle-outline"
          label="Needs work"
          onPress={() => handlePress('needs_work')}
        />
        <FeedbackButton
          icon="create-outline"
          label="Note"
          onPress={() => handlePress('note')}
        />
      </View>
    </View>
  );
}

function FeedbackButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={14} color={paper.dashboardInk} />
      <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit>
        {label.toUpperCase()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    gap: paperSpacing.md,
  },
  cardCompact: {
    marginTop: paperSpacing.md,
  },
  requestCard: {
    borderColor: 'rgba(192,57,43,0.2)',
    backgroundColor: '#FFF7F2',
  },
  miniRequestCard: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.24)',
    borderRadius: 9,
    backgroundColor: '#FFF7F2',
  },
  miniRequestIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  miniRequestCopy: {
    minWidth: 0,
    flex: 1,
  },
  miniRequestTitle: {
    marginTop: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 12.5,
    lineHeight: 16,
    color: paper.dashboardInk,
  },
  miniRequestAction: {
    maxWidth: 122,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 0.8,
    color: paper.redDk,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: '#F6F9FB',
  },
  requestIconBadge: {
    borderColor: 'rgba(192,57,43,0.2)',
    backgroundColor: '#FBE4E1',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardBlue,
    letterSpacing: 1.7,
  },
  requestEyebrow: {
    color: paper.redDk,
  },
  title: {
    marginTop: 2,
    fontFamily: paperFonts.bodyBold,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  requestTitle: {
    marginTop: 2,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 19,
    lineHeight: 23,
    color: paper.dashboardInk,
  },
  requestBody: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: paper.dashboardMuted,
  },
  requestButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    backgroundColor: paper.dashboardInk,
  },
  requestButtonPressed: {
    opacity: 0.88,
  },
  requestButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.3,
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: paperSpacing.xs,
  },
  button: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.dashboardWhite,
    paddingVertical: 9,
    paddingHorizontal: 5,
  },
  buttonPressed: {
    backgroundColor: '#F6F9FB',
    opacity: 0.9,
  },
  buttonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 1,
  },
});
