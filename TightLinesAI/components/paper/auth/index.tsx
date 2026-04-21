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

import type { ReactNode } from 'react';
import {
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
  paperRadius,
  paperShadows,
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
      <Ionicons name="chevron-back" size={14} color={paper.ink} />
      <Text style={styles.backBtnText}>{label}</Text>
    </Pressable>
  );
}

// ─── Screen header (eyebrow + serif title + italic subtitle) ─────────────

interface AuthHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function AuthHeader({ eyebrow, title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
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
    status === 'valid' ? paper.forest
    : status === 'invalid' ? paper.red
    : paper.ink;

  const showTrailing = trailing !== undefined || status !== undefined;

  return (
    <View style={[styles.field, fieldStyle]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={[styles.inputRow, { borderColor }]}>
        <TextInput
          placeholderTextColor="rgba(28,36,25,0.45)"
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
              <Ionicons name="checkmark-circle" size={18} color={paper.forest} />
            ) : null}
            {status === 'invalid' && !trailing ? (
              <Ionicons name="close-circle" size={18} color={paper.red} />
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
      <Ionicons name={iconName} size={15} color={paper.ink} />
      <Text style={styles.tipText}>{children}</Text>
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

interface AuthStatusCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  children: ReactNode;
}

export function AuthStatusCard({ iconName, title, children }: AuthStatusCardProps) {
  return (
    <View style={styles.statusCard}>
      <View style={styles.statusIconWrap}>
        <Ionicons name={iconName} size={28} color={paper.paper} />
      </View>
      <Text style={styles.statusTitle}>{title}</Text>
      <View style={styles.statusBody}>{children}</View>
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
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 2.2,
  },

  // Header
  header: {
    gap: 4,
  },
  eyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.red,
    letterSpacing: 3,
    marginBottom: 6,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 36,
    lineHeight: 38,
    color: paper.ink,
    letterSpacing: -1.1,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: paper.ink,
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
    color: paper.ink,
    opacity: 0.7,
    letterSpacing: 2.6,
  },
  inputRow: {
    position: 'relative',
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    backgroundColor: paper.paperLight,
  },
  input: {
    paddingHorizontal: paperSpacing.md,
    paddingVertical: 14,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.ink,
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
    color: paper.red,
    letterSpacing: 0.1,
  },
  fieldSuccess: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    color: paper.forest,
    letterSpacing: 0.1,
  },

  // Buttons
  btnPrimary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: paper.forest,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    ...paperShadows.hard,
  },
  btnPrimaryPressed: {
    backgroundColor: paper.forestDk,
  },
  btnPrimaryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.paper,
    letterSpacing: 2.8,
  },
  btnSecondary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
  },
  btnSecondaryPressed: {
    backgroundColor: paper.paperDark,
  },
  btnSecondaryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.ink,
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
    backgroundColor: paper.inkHair,
  },
  dividerText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
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
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderLeftWidth: 6,
    borderLeftColor: paper.gold,
    borderRadius: paperRadius.card,
  },
  tipText: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 13.5,
    color: paper.ink,
    opacity: 0.85,
    lineHeight: 19,
  },

  // Text link row
  textLinkRow: {
    alignItems: 'center',
    paddingTop: paperSpacing.sm,
  },
  textLinkLead: {
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    color: paper.ink,
    opacity: 0.7,
  },
  textLinkBold: {
    fontFamily: paperFonts.bodyBold,
    color: paper.forest,
    opacity: 1,
    letterSpacing: 0.3,
  },

  // Status card (used by verify-email + success states)
  statusCard: {
    alignItems: 'center',
    padding: paperSpacing.xl,
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    gap: paperSpacing.sm,
    ...paperShadows.hard,
  },
  statusIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: paper.forest,
    borderWidth: 2,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...paperShadows.hard,
  },
  statusTitle: {
    fontFamily: paperFonts.display,
    fontSize: 26,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.8,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 6,
  },
  statusBody: {
    alignItems: 'center',
  },
});
