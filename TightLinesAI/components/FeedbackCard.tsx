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
};

export function FeedbackCard({
  featureName,
  topic,
  contextLines = [],
  profile,
  user,
  compact = false,
}: FeedbackCardProps) {
  const router = useRouter();
  const handlePress = (sentiment: FeedbackSentiment) => {
    router.push({
      pathname: '/support',
      params: {
        topic,
        sentiment,
        featureName,
        contextLines: JSON.stringify([
          `Feature: ${featureName}`,
          profile?.username ? `Username: @${profile.username}` : null,
          user?.email ? `Email: ${user.email}` : null,
          ...contextLines,
        ].filter(Boolean)),
      },
    });
  };

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
  title: {
    marginTop: 2,
    fontFamily: paperFonts.bodyBold,
    fontSize: 15,
    color: paper.dashboardInk,
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
