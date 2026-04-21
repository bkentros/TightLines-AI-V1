/**
 * FinFindr's signature section cue — an all-caps, widely letterspaced label
 * in accent red, sometimes wrapped in dashes ("— GOOD MORNING, ANGLER —").
 *
 *     <SectionEyebrow>GOOD MORNING, ANGLER</SectionEyebrow>
 *     <SectionEyebrow dashes={false}>RIGHT NOW</SectionEyebrow>
 *     <SectionEyebrow color={paper.ink}>THE WEEK AHEAD</SectionEyebrow>
 */

import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

interface SectionEyebrowProps {
  children: string;
  /** Wrap label with em-dashes on each side. Default true. */
  dashes?: boolean;
  color?: string;
  size?: number;
  /** Letter spacing in absolute units (RN does not support em). Default 3. */
  tracking?: number;
  align?: 'left' | 'center' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function SectionEyebrow({
  children,
  dashes = true,
  color = paper.red,
  size = 11,
  tracking = 3,
  align = 'center',
  style,
  textStyle,
}: SectionEyebrowProps) {
  const text = dashes ? `— ${children} —` : children;
  return (
    <View
      style={[
        styles.wrap,
        align === 'left' && styles.alignLeft,
        align === 'right' && styles.alignRight,
        align === 'center' && styles.alignCenter,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color, fontSize: size, letterSpacing: tracking },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  alignLeft: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignRight: { alignItems: 'flex-end' },
  label: {
    fontFamily: paperFonts.bodyBold,
    fontWeight: '700',
  },
});
