import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../lib/theme';

interface SelectProps {
  value: string | null;
  options: string[];
  placeholder?: string;
  onSelect: (value: string | null) => void;
}

export default function Select({
  value,
  options,
  placeholder = 'Select',
  onSelect,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const pick = (v: string | null) => {
    onSelect(v);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.text, !value && styles.placeholder]}>
          {value ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>{placeholder}</Text>
            <ScrollView
              style={styles.list}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* N/A option */}
              <Pressable
                style={[styles.option, value === 'N/A' && styles.optionActive]}
                onPress={() => pick('N/A')}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === 'N/A' && styles.optionTextActive,
                  ]}
                >
                  N/A
                </Text>
                {value === 'N/A' && (
                  <Ionicons name="checkmark" size={18} color={colors.sage} />
                )}
              </Pressable>

              <View style={styles.separator} />

              {options.map((opt) => (
                <Pressable
                  key={opt}
                  style={[
                    styles.option,
                    value === opt && styles.optionActive,
                  ]}
                  onPress={() => pick(opt)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === opt && styles.optionTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                  {value === opt && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.sage}
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={styles.cancelBtn}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    minHeight: 44,
  },
  triggerPressed: {
    backgroundColor: colors.surfacePressed,
  },
  text: {
    fontSize: 15,
    color: colors.text,
  },
  placeholder: {
    color: colors.textMuted,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '55%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  optionActive: {
    backgroundColor: colors.sageLight,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.sage,
    fontWeight: '500',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.xs,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
