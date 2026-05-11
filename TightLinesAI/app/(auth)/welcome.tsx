/**
 * Welcome / landing screen — FinFindr dashboard language.
 *
 * Behavior is unchanged from the previous TightLines-era version: email
 * sign-up, email sign-in, and Apple Sign-In routes all still trigger the
 * same handlers against the same auth store. Only visuals changed.
 */

import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import { signInWithApple } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import {
  CornerMarkSet,
  TopographicLines,
} from '../../components/paper';
import {
  AuthFooterStamp,
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthDivider,
} from '../../components/paper/auth';

export default function WelcomeScreen() {
  const router = useRouter();
  const { fetchProfile, setSession } = useAuthStore();

  // Live pulse on the eyebrow dot — matches the home dashboard and
  // every renovated feature header. Native driver, native opacity loop.
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const handleAppleSignIn = async () => {
    try {
      const nonce = Crypto.randomUUID();
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce,
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        throw new Error('Apple Sign-In: no identity token returned');
      }

      const { data, error } = await signInWithApple(
        credential.identityToken,
        nonce,
      );

      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        await fetchProfile(data.session.user.id);
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes('ERR_REQUEST_CANCELED')
      ) {
        return;
      }
      console.error('Apple Sign-In error:', err);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.container}>
          {/* Brand hero — ink-framed paper panel with topo lines and gold corners. */}
          <View style={styles.hero}>
            <TopographicLines
              style={styles.heroTopo}
              color={paper.walnut}
              count={7}
            />
            <CornerMarkSet color={paper.bandFair} size={16} thickness={2} inset={10} />

            {/* Eyebrow row — pulse dot + label + ruled flank + diamond
                ornament. Same anatomy as the renovated section
                mastheads + AuthHeader so welcome reads as part of the
                same editorial family. */}
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowPulseWrap}>
                <View style={styles.eyebrowPulseRing} />
                <Animated.View
                  style={[styles.eyebrowPulseDot, { opacity: pulse }]}
                />
              </View>
              <Text style={styles.eyebrow}>FIELD GUIDE</Text>
              <View style={styles.eyebrowFlankRule} />
              <Text style={styles.eyebrowDiamond}>◆</Text>
            </View>
            <Text style={styles.brandMark}>FINFINDR.</Text>
            <View style={styles.brandRule} />
            <Text style={styles.tagline}>
              Find the bite before you head out.
            </Text>
          </View>

          {/* Value props — editorial bullet list */}
          <View style={styles.valueProps}>
            {[
              { icon: 'fish-outline', text: "Tackle Box picks for today's conditions" },
              { icon: 'calendar-outline', text: '7-day Daily Read outlooks for planning trips' },
              { icon: 'camera-outline', text: 'Water Read for structure, cover, and holding water' },
            ].map((item) => (
              <View key={item.icon} style={styles.valueProp}>
                <View style={styles.valueIconWrap}>
                  <Ionicons name={item.icon as any} size={16} color={paper.dashboardBlue} />
                </View>
                <Text style={styles.valuePropText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* CTAs */}
          <View style={styles.actions}>
            <AuthPrimaryButton
              label="Create account"
              onPress={() => router.push('/(auth)/sign-up')}
            />

            <AuthSecondaryButton
              label="Sign in"
              onPress={() => router.push('/(auth)/sign-in')}
            />

            {Platform.OS === 'ios' && (
              <>
                <AuthDivider />

                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={
                    AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                  }
                  buttonStyle={
                    AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                  }
                  cornerRadius={12}
                  style={styles.appleBtn}
                  onPress={handleAppleSignIn}
                />
              </>
            )}
          </View>

          {/* Footer mark */}
          <View style={styles.footerCol}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>FINFINDR</Text>
              <Text style={styles.footerMono}>MADE FOR THE WATER</Text>
            </View>
            {/* Pressed-edition stamp — same finishing signature used on
                the Today's Bite report and every other auth screen. */}
            <AuthFooterStamp />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.lg,
    justifyContent: 'space-between',
  },

  hero: {
    position: 'relative',
    marginTop: paperSpacing.xl,
    paddingVertical: paperSpacing.xl,
    paddingHorizontal: paperSpacing.lg,
    alignItems: 'center',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 2,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    overflow: 'hidden',
      },
  heroTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    zIndex: 1,
    paddingHorizontal: 8,
  },
  eyebrowPulseWrap: {
    width: 9,
    height: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrowPulseRing: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.45,
  },
  eyebrowPulseDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: paper.dashboardBlue,
  },
  eyebrowFlankRule: {
    width: 26,
    height: 1,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  eyebrowDiamond: {
    fontFamily: paperFonts.body,
    fontSize: 9,
    color: paper.dashboardBlue,
    opacity: 0.6,
    lineHeight: 11,
  },
  eyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.dashboardBlue,
    letterSpacing: 3,
    zIndex: 1,
  },
  brandMark: {
    fontFamily: paperFonts.display,
    fontSize: 54,
    color: paper.dashboardInk,
    letterSpacing: 0,
    fontWeight: '700',
    marginTop: 6,
    zIndex: 1,
  },
  brandRule: {
    width: 56,
    height: 3,
    backgroundColor: paper.dashboardBlue,
    marginTop: 10,
    borderRadius: 1,
    zIndex: 1,
  },
  tagline: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: paper.dashboardInk,
    opacity: 0.75,
    marginTop: 10,
    textAlign: 'center',
    zIndex: 1,
  },

  valueProps: {
    // Bumped from `sm + 2` (10) to `md` (16) so the three value-prop
    // cards read as discrete, equally-weighted features rather than a
    // tightly stacked list.
    gap: paperSpacing.md,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    backgroundColor: paper.dashboardCream,
    borderRadius: 12,
    padding: paperSpacing.md,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
  },
  valueIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valuePropText: {
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 14,
    color: paper.dashboardInk,
  },

  actions: { gap: paperSpacing.sm },
  appleBtn: { height: 52, width: '100%' },

  footerCol: {
    gap: 4,
    marginTop: paperSpacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1.5,
    borderTopColor: paper.dashboardInk,
    paddingTop: paperSpacing.sm + 2,
  },
  footerText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.55,
    letterSpacing: 2.8,
  },
  footerMono: {
    fontFamily: paperFonts.mono,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.55,
    letterSpacing: 2.4,
  },
});
