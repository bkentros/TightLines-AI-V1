import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { paper, paperFonts, paperSpacing } from '../../lib/theme';
import { useSubscriptionCelebrationStore } from '../../store/subscriptionCelebrationStore';
import { TopographicLines } from './TopographicLines';

export function AnglerUnlockedModal() {
  const insets = useSafeAreaInsets();
  const visible = useSubscriptionCelebrationStore((s) => s.visible);
  const mode = useSubscriptionCelebrationStore((s) => s.mode);
  const detail = useSubscriptionCelebrationStore((s) => s.detail);
  const title = useSubscriptionCelebrationStore((s) => s.title);
  const message = useSubscriptionCelebrationStore((s) => s.message);
  const tone = useSubscriptionCelebrationStore((s) => s.tone);
  const hide = useSubscriptionCelebrationStore((s) => s.hide);

  const isSuccess = mode === 'success';
  const accent = tone === 'error' ? paper.bandTough : paper.dashboardBlue;
  const iconName = isSuccess
    ? 'checkmark'
    : tone === 'error'
    ? 'alert-circle-outline'
    : 'information-circle-outline';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={hide}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { marginBottom: insets.bottom }]}>
          <View style={styles.hero}>
            <TopographicLines
              style={styles.heroTopo}
              color="rgba(255,255,255,0.14)"
              count={5}
            />
            <Text style={styles.eyebrow}>
              {isSuccess ? 'FINFINDR · MEMBERSHIP' : 'FINFINDR · MEMBERSHIP'}
            </Text>
            <View style={[styles.iconBadge, !isSuccess && { borderWidth: 1, borderColor: accent }]}>
              <Ionicons
                name={iconName}
                size={isSuccess ? 22 : 24}
                color={isSuccess ? paper.dashboardInk : accent}
              />
            </View>
            {isSuccess ? (
              <Text style={styles.title}>
                FULL ACCESS{'\n'}
                <Text style={styles.titleAccent}>UNLOCKED.</Text>
              </Text>
            ) : (
              <Text style={styles.title}>{title}</Text>
            )}
          </View>

          <View style={styles.body}>
            <Text style={styles.copy}>
              {isSuccess
                ? 'Angler is active on this account. Bite reports, Tackle Box, and Water Read are ready whenever you are.'
                : message}
            </Text>
            {isSuccess && detail ? <Text style={styles.detail}>{detail}</Text> : null}
            <Pressable
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
              onPress={hide}
            >
              <Text style={styles.ctaText}>{isSuccess ? 'CONTINUE' : 'GOT IT'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 25, 43, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: paperSpacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    backgroundColor: paper.dashboardWhite,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  hero: {
    backgroundColor: paper.dashboardInk,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.md,
    paddingHorizontal: paperSpacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroTopo: {
    ...StyleSheet.absoluteFillObject,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 2,
    color: paper.bandFair,
    marginBottom: paperSpacing.sm,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: paper.dashboardCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: paperSpacing.sm,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 26,
    lineHeight: 30,
    color: paper.dashboardWhite,
    textAlign: 'center',
  },
  titleAccent: {
    color: paper.dashboardBlueLight,
  },
  body: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.lg,
    gap: paperSpacing.sm,
  },
  copy: {
    fontFamily: paperFonts.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: paper.dashboardInk,
    opacity: 0.82,
    textAlign: 'center',
  },
  detail: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
    color: paper.dashboardBlue,
    textAlign: 'center',
  },
  cta: {
    marginTop: paperSpacing.sm,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: paper.dashboardInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.dashboardWhite,
  },
});
