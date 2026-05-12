/**
 * Shared paper-language primitives for the auth flow.
 *
 * Centralizing these in one place keeps all five auth screens (welcome,
 * sign-in, sign-up, forgot-password, reset-password, verify-email) visually
 * identical. Each screen still owns its own layout, copy, and behavior —
 * these primitives only standardize visual vocabulary.
 *
 * Nothing here knows about Supabase, validation, or routing. They are
 * presentation-only.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../../lib/theme';

// ─── Back rail ───────────────────────────────────────────────────────────

interface AuthBackButtonProps {
  onPress: () => void;
  label?: string;
}

export function AuthBackButton({ onPress, label = 'BACK' }: AuthBackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.backBtn,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Ionicons name="chevron-back" size={14} color={paper.dashboardInk} />
      <Text style={styles.backBtnText}>{label}</Text>
    </Pressable>
  );
}

// ─── Screen header (eyebrow + serif title + italic subtitle) ─────────────
//
// Premium polish: the eyebrow row now reads as a small section masthead —
// pulsing live dot on the left, eyebrow label, then a hairline rule that
// extends to a diamond ornament on the right. Same chapter-break grammar
// the Today's Bite and Tackle Box section headers use, so every auth
// screen feels native to the same editorial system. Pulse is native-
// driver opacity — no per-frame layout work.

interface AuthHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function AuthHeader({ eyebrow, title, subtitle }: AuthHeaderProps) {
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

  return (
    <View style={styles.header}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowPulseWrap}>
          <View style={styles.eyebrowPulseRing} />
          <Animated.View style={[styles.eyebrowPulseDot, { opacity: pulse }]} />
        </View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <View style={styles.eyebrowRule} />
        <Text style={styles.eyebrowOrnament}>◆</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

// ─── Label + input field ─────────────────────────────────────────────────

interface AuthFieldProps extends TextInputProps {
  label: string;
  /** 'valid' | 'invalid' | undefined — drives border color + trailing icon */
  status?: 'valid' | 'invalid';
  /** Inline error message shown below the field */
  errorText?: string;
  /** Inline success message shown below the field */
  successText?: string;
  /** Trailing element (e.g. eye toggle) */
  trailing?: ReactNode;
  /** Extra padding on the right for trailing-icon fields */
  reserveTrailingSpace?: boolean;
  /** Field container style (wraps label + input) */
  fieldStyle?: StyleProp<ViewStyle>;
}

export function AuthField({
  label,
  status,
  errorText,
  successText,
  trailing,
  reserveTrailingSpace,
  fieldStyle,
  style,
  ...inputProps
}: AuthFieldProps) {
  const borderColor =
    status === 'valid' ? paper.bandPrime
    : status === 'invalid' ? paper.bandTough
    : paper.dashboardLine;

  const showTrailing = trailing !== undefined || status !== undefined;

  return (
    <View style={[styles.field, fieldStyle]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={[styles.inputRow, { borderColor }]}>
        <TextInput
          placeholderTextColor={paper.dashboardMuted}
          {...inputProps}
          style={[
            styles.input,
            (showTrailing || reserveTrailingSpace) && styles.inputWithTrailing,
            style,
          ]}
        />
        {showTrailing ? (
          <View style={styles.trailingSlot} pointerEvents="box-none">
            {trailing}
            {status === 'valid' && !trailing ? (
              <Ionicons name="checkmark-circle" size={18} color={paper.bandPrime} />
            ) : null}
            {status === 'invalid' && !trailing ? (
              <Ionicons name="close-circle" size={18} color={paper.bandTough} />
            ) : null}
          </View>
        ) : null}
      </View>
      {errorText ? (
        <Text style={styles.fieldError}>{errorText}</Text>
      ) : successText ? (
        <Text style={styles.fieldSuccess}>{successText}</Text>
      ) : null}
    </View>
  );
}

// ─── Primary / secondary CTAs ────────────────────────────────────────────

interface AuthPrimaryButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AuthPrimaryButton({
  label,
  loading,
  loadingLabel,
  disabled,
  style,
  ...rest
}: AuthPrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btnPrimary,
        pressed && !isDisabled && styles.btnPrimaryPressed,
        isDisabled && styles.btnDisabled,
        style,
      ]}
    >
      <Text style={styles.btnPrimaryText}>
        {loading ? (loadingLabel ?? 'WORKING…') : label.toUpperCase()}
      </Text>
    </Pressable>
  );
}

interface AuthSecondaryButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AuthSecondaryButton({
  label,
  disabled,
  style,
  ...rest
}: AuthSecondaryButtonProps) {
  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btnSecondary,
        pressed && !disabled && styles.btnSecondaryPressed,
        disabled && styles.btnDisabled,
        style,
      ]}
    >
      <Text style={styles.btnSecondaryText}>{label.toUpperCase()}</Text>
    </Pressable>
  );
}

// ─── "or" divider ────────────────────────────────────────────────────────

export function AuthDivider({ label = 'OR' }: { label?: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

// ─── Information callout (tip / helper) ──────────────────────────────────

interface AuthTipProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
}

export function AuthTip({ iconName = 'information-circle-outline', children }: AuthTipProps) {
  return (
    <View style={styles.tip}>
      <Ionicons name={iconName} size={15} color={paper.dashboardInk} />
      <Text style={styles.tipText}>{children}</Text>
    </View>
  );
}

interface AuthNoticeProps {
  title: string;
  message?: string;
  tone?: 'info' | 'success' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

export function AuthNotice({
  title,
  message,
  tone = 'info',
  actionLabel,
  onAction,
}: AuthNoticeProps) {
  const iconName =
    tone === 'success' ? 'checkmark-circle-outline'
    : tone === 'error' ? 'alert-circle-outline'
    : 'information-circle-outline';
  const accent =
    tone === 'success' ? paper.bandPrime
    : tone === 'error' ? paper.bandTough
    : paper.dashboardBlue;

  return (
    <View style={[styles.notice, { borderColor: accent }]}>
      <View style={styles.noticeHeader}>
        <Ionicons name={iconName} size={18} color={accent} />
        <Text style={styles.noticeTitle}>{title}</Text>
      </View>
      {message ? <Text style={styles.noticeMessage}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.noticeAction,
            { borderColor: accent },
            pressed && styles.noticeActionPressed,
          ]}
        >
          <Text style={[styles.noticeActionText, { color: accent }]}>
            {actionLabel.toUpperCase()}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ─── Textual link (footer "already have an account?" style row) ──────────

interface AuthTextLinkProps {
  leadText: string;
  linkText: string;
  onPress: () => void;
}

export function AuthTextLink({ leadText, linkText, onPress }: AuthTextLinkProps) {
  return (
    <Pressable onPress={onPress} style={styles.textLinkRow}>
      <Text style={styles.textLinkLead}>
        {leadText}{' '}
        <Text style={styles.textLinkBold}>{linkText}</Text>
      </Text>
    </Pressable>
  );
}

// ─── Small gold-ruled emphasis card (for verify-email / success states) ──
//
// The icon now sits inside an editor's-seal-style concentric ring with
// four ribbon-tinted accent dots at the cardinal points — same anatomy
// as the renovated Today's Bite Guide Note badge. Reads as a pressed
// almanac signet, not a plain icon chip.

interface AuthStatusCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  children: ReactNode;
}

export function AuthStatusCard({ iconName, title, children }: AuthStatusCardProps) {
  return (
    <View style={styles.statusCard}>
      <View style={styles.statusIconSealWrap}>
        <View style={styles.statusIconSealOuter} />
        <View style={styles.statusIconWrap}>
          <Ionicons name={iconName} size={28} color="#FFFFFF" />
        </View>
        <View style={[styles.statusIconSealDot, styles.statusIconSealDotTop]} />
        <View style={[styles.statusIconSealDot, styles.statusIconSealDotRight]} />
        <View style={[styles.statusIconSealDot, styles.statusIconSealDotBottom]} />
        <View style={[styles.statusIconSealDot, styles.statusIconSealDotLeft]} />
      </View>
      <Text style={styles.statusTitle}>{title}</Text>
      <View style={styles.statusBody}>{children}</View>
    </View>
  );
}

// ─── Edition stamp footer ────────────────────────────────────────────────
//
// Small pressed-edition stamp ("EDITION · MAY 11 · 2026") — the same
// almanac signature that finishes the Today's Bite report. Gives every
// auth screen a finished "this is an issue" voice. Date is computed at
// render time (no engine plumbing). Centered between two short hairline
// rules; JetBrains Mono Bold at 8.5 px with 2 px tracking and 70%
// opacity.

export function AuthFooterStamp() {
  const d = new Date();
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  const label = `EDITION · ${month} ${day} · ${year}`;
  return (
    <View style={styles.footerStampRow}>
      <View style={styles.footerStampRule} />
      <Text style={styles.footerStampText}>{label}</Text>
      <View style={styles.footerStampRule} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Back
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
  },

  // Header
  header: {
    gap: 4,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  eyebrowPulseWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrowPulseRing: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.45,
  },
  eyebrowPulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.dashboardBlue,
  },
  eyebrowRule: {
    flex: 1,
    height: 1,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  eyebrowOrnament: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    color: paper.dashboardBlue,
    opacity: 0.6,
    lineHeight: 12,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    color: paper.dashboardBlue,
    letterSpacing: 3,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 36,
    lineHeight: 38,
    color: paper.dashboardInk,
    letterSpacing: 0,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: paper.dashboardInk,
    opacity: 0.75,
    lineHeight: 21,
    marginTop: 6,
  },

  // Field
  field: {
    gap: 6,
  },
  label: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.7,
    letterSpacing: 2.6,
  },
  inputRow: {
    position: 'relative',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: paper.dashboardWhite,
  },
  input: {
    paddingHorizontal: paperSpacing.md,
    paddingVertical: 14,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
    // Disable default iOS underline on Android would go here, but RN
    // TextInput handles this fine with the borderWidth pattern.
  },
  inputWithTrailing: {
    paddingRight: 44,
  },
  trailingSlot: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldError: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    color: paper.bandTough,
    letterSpacing: 0.1,
  },
  fieldSuccess: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    color: paper.bandPrime,
    letterSpacing: 0.1,
  },

  // Buttons
  btnPrimary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: paper.dashboardInk,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
  },
  btnPrimaryPressed: {
    backgroundColor: paper.dashboardBlue,
  },
  btnPrimaryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 2.8,
  },
  btnSecondary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
  },
  btnSecondaryPressed: {
    backgroundColor: '#F6F9FB',
  },
  btnSecondaryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardInk,
    letterSpacing: 2.8,
  },
  btnDisabled: {
    opacity: 0.45,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginVertical: paperSpacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: paper.dashboardHair,
  },
  dividerText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 2.6,
    opacity: 0.55,
  },

  // Tip callout
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderLeftWidth: 6,
    borderLeftColor: paper.dashboardBlue,
    borderRadius: 12,
  },
  tipText: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 13.5,
    color: paper.dashboardInk,
    opacity: 0.85,
    lineHeight: 19,
  },

  // Notice card
  notice: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderRadius: 12,
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
    letterSpacing: 0.2,
  },
  noticeMessage: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.75,
    lineHeight: 18,
  },
  noticeAction: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.xs,
    marginTop: paperSpacing.xs,
  },
  noticeActionPressed: {
    backgroundColor: '#F6F9FB',
  },
  noticeActionText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.8,
  },

  // Text link row
  textLinkRow: {
    alignItems: 'center',
    paddingTop: paperSpacing.sm,
  },
  textLinkLead: {
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    color: paper.dashboardInk,
    opacity: 0.7,
  },
  textLinkBold: {
    fontFamily: paperFonts.bodyBold,
    color: paper.dashboardBlue,
    opacity: 1,
    letterSpacing: 0.3,
  },

  // Status card (used by verify-email + success states)
  statusCard: {
    alignItems: 'center',
    padding: paperSpacing.xl,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    gap: paperSpacing.sm,
  },
  statusIconSealWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusIconSealOuter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardBlue,
    opacity: 0.45,
  },
  statusIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: paper.dashboardInk,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconSealDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  statusIconSealDotTop: { top: 0, alignSelf: 'center' },
  statusIconSealDotBottom: { bottom: 0, alignSelf: 'center' },
  statusIconSealDotLeft: { left: 0, top: '50%', marginTop: -2 },
  statusIconSealDotRight: { right: 0, top: '50%', marginTop: -2 },
  statusTitle: {
    fontFamily: paperFonts.display,
    fontSize: 26,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 6,
  },
  statusBody: {
    alignItems: 'center',
  },

  // Edition stamp footer — short hairline rules flanking a date string.
  footerStampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: paperSpacing.sm,
  },
  footerStampRule: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    maxWidth: 32,
    backgroundColor: paper.dashboardLine,
    opacity: 0.65,
  },
  footerStampText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 2,
    color: paper.dashboardMuted,
    opacity: 0.7,
  },
});
