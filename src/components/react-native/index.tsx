import { FC } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { useI18n } from '../../i18n';

// DM Sans / Playfair have no Arabic glyphs, so in Arabic we drop the custom
// family and keep the intended weight on the system font.
const ARABIC_WEIGHT: Record<string, TextStyle['fontWeight']> = {
  [FONTS.regular]: '400',
  [FONTS.medium]: '500',
  [FONTS.semiBold]: '600',
  [FONTS.bold]: '700',
  [FONTS.headingSemiBold]: '600',
  [FONTS.heading]: '700',
};

// Shared by Text and TextInput: Arabic font, right alignment, no letter-spacing
// (spacing breaks the joined Arabic letters).
export const useLocalizedTextStyle = (style: StyleProp<TextStyle>): StyleProp<TextStyle> => {
  const { isRTL } = useI18n();
  if (!isRTL) return style;
  const flat = StyleSheet.flatten(style) ?? {};
  const family = flat.fontFamily;
  return [
    style,
    {
      fontFamily: undefined,
      fontWeight: family ? ARABIC_WEIGHT[family] ?? flat.fontWeight : flat.fontWeight,
      letterSpacing: 0,
      textAlign: flat.textAlign ?? 'right',
      writingDirection: 'rtl',
    },
  ];
};

// Text with the app's default font and color.
export const TextCustom: FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={useLocalizedTextStyle([styles.text, style])} />
);

// Playfair heading text.
export const HeadingText: FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={useLocalizedTextStyle([styles.heading, style])} />
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
