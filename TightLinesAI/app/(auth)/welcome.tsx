/**
 * Welcome / landing screen — FinFindr paper language.
 *
 * Behavior is unchanged from the previous TightLines-era version: email
 * sign-up, email sign-in, and Apple Sign-In routes all still trigger the
 * same handlers against the same auth store. Only visuals changed.
 */

import {
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
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import { signInWithApple } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import {
  PaperBackground,
  CornerMarkSet,
  TopographicLines,
} from '../../components/paper';
import {
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthDivider,
} from '../../components/paper/auth';

export default function WelcomeScreen() {
  const router = useRouter();
  const { fetchProfile, setSession } = useAuthStore();

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
    <PaperBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.container}>
          {/* Brand hero — ink-framed paper panel with topo lines and gold corners. */}
          <View style={styles.hero}>
            <TopographicLines
              style={styles.heroTopo}
              color={paper.walnut}
              count={7}
            />
            <CornerMarkSet color={paper.gold} size={16} thickness={2} inset={10} />

            <Text style={styles.eyebrow}>FIELD GUIDE</Text>
            <Text style={styles.brandMark}>FINFINDR.</Text>
            <View style={styles.brandRule} />
            <Text style={styles.tagline}>
              Find the bite before you head out.
            </Text>
          </View>

          {/* Value props — editorial bullet list */}
          <View style={styles.valueProps}>
            {[
              { icon: 'fish-outline', text: "Lure and fly picks for today's conditions" },
              { icon: 'calendar-outline', text: '7-day fishing outlooks for planning trips' },
              { icon: 'camera-outline', text: 'Water Reader for structure, cover, and holding water' },
            ].map((item) => (
              <View key={item.icon} style={styles.valueProp}>
                <View style={styles.valueIconWrap}>
                  <Ionicons name={item.icon as any} size={16} color={paper.forest} />
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
                  cornerRadius={paperRadius.card}
                  style={styles.appleBtn}
                  onPress={handleAppleSignIn}
                />
              </>
            )}
          </View>

          {/* Footer mark */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>FINFINDR</Text>
            <Text style={styles.footerMono}>MADE FOR THE WATER</Text>
          </View>
        </View>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    overflow: 'hidden',
    ...paperShadows.hard,
  },
  heroTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  eyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.red,
    letterSpacing: 3,
    zIndex: 1,
  },
  brandMark: {
    fontFamily: paperFonts.display,
    fontSize: 54,
    color: paper.ink,
    letterSpacing: -2,
    fontWeight: '700',
    marginTop: 6,
    zIndex: 1,
  },
  brandRule: {
    width: 56,
    height: 3,
    backgroundColor: paper.forest,
    marginTop: 10,
    borderRadius: 1,
    zIndex: 1,
  },
  tagline: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: paper.ink,
    opacity: 0.75,
    marginTop: 10,
    textAlign: 'center',
    zIndex: 1,
  },

  valueProps: {
    gap: paperSpacing.sm + 2,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    borderWidth: 1.5,
    borderColor: paper.ink,
  },
  valueIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valuePropText: {
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 14,
    color: paper.ink,
  },

  actions: { gap: paperSpacing.sm },
  appleBtn: { height: 52, width: '100%' },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1.5,
    borderTopColor: paper.ink,
    paddingTop: paperSpacing.sm + 2,
    marginTop: paperSpacing.sm,
  },
  footerText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 2.8,
  },
  footerMono: {
    fontFamily: paperFonts.mono,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 2.4,
  },
});
