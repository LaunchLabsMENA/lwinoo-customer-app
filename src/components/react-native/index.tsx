import { FC } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';

// Text with the app's default font and color.
export const TextCustom: FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[styles.text, style]} />
);

// Playfair heading text.
export const HeadingText: FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[styles.heading, style]} />
);

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.ink,
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: COLORS.ink,
  },
});
