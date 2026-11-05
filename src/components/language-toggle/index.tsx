import { FC } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Globe } from 'lucide-react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { useI18n, type Locale } from '../../i18n';
import { TextCustom } from '../react-native';

// Each label is written in its own language so it is readable before switching.
const SWITCH_TO: Record<Locale, { locale: Locale; label: string }> = {
  en: { locale: 'ar', label: 'العربية' },
  ar: { locale: 'en', label: 'English' },
};

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const LanguageToggle: FC<Props> = ({ style }) => {
  const { locale, setLocale } = useI18n();
  const next = SWITCH_TO[locale];

  return (
    <Pressable
      onPress={() => setLocale(next.locale)}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed, style]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={next.label}
    >
      <Globe size={14} color={COLORS.brandDeep} />
      <TextCustom style={styles.label}>{next.label}</TextCustom>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brandSoft,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.brandDeep,
  },
});
