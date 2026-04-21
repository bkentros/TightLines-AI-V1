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
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../lib/theme';

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
        <Ionicons name="chevron-down" size={16} color={paper.ink} />
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
                  <Ionicons name="checkmark" size={18} color={paper.forest} />
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
                      color={paper.forest}
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={({ pressed }) => [
                styles.cancelBtn,
                pressed && styles.cancelBtnPressed,
              ]}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
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
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 4,
    minHeight: 44,
  },
  triggerPressed: {
    backgroundColor: paper.paperDark,
  },
  text: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.ink,
  },
  placeholder: {
    color: paper.ink,
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 36, 25, 0.45)',
  },
  sheet: {
    backgroundColor: paper.paper,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: paper.ink,
    paddingBottom: 34,
    maxHeight: '55%',
    ...paperShadows.hard,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: paper.ink,
    opacity: 0.3,
    alignSelf: 'center',
    marginTop: paperSpacing.sm + 2,
    marginBottom: paperSpacing.md,
  },
  title: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    textAlign: 'center',
    letterSpacing: 2.4,
    marginBottom: paperSpacing.md,
  },
  list: {
    paddingHorizontal: paperSpacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: paperSpacing.sm + 2,
    paddingHorizontal: paperSpacing.sm,
    borderRadius: paperRadius.chip,
  },
  optionActive: {
    backgroundColor: paper.paperDark,
  },
  optionText: {
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.ink,
  },
  optionTextActive: {
    color: paper.forest,
    fontFamily: paperFonts.bodyBold,
  },
  separator: {
    height: 1,
    backgroundColor: paper.inkHair,
    marginVertical: paperSpacing.xs,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: paperSpacing.md - 2,
    marginTop: paperSpacing.sm,
    marginHorizontal: paperSpacing.lg,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paperLight,
  },
  cancelBtnPressed: {
    backgroundColor: paper.paperDark,
  },
  cancelText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.2,
  },
});
