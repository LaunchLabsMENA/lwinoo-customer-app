import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';
import { useI18n } from '../../i18n';

type Props = {
  title: string;
  onBack?: () => void;
};

const BACK_SIZE = 40;

// Round filled back button, same shape as Ora's AppBackButton, in LWINOO's brand colour.
export const BackButton: FC<{ onPress: () => void }> = ({ onPress }) => {
  const { isRTL, t } = useI18n();
  const Icon = isRTL ? ChevronRight : ChevronLeft;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={t('common.back')}
    >
      <Icon size={22} color={COLORS.white} strokeWidth={2} />
    </Pressable>
  );
};

export const ScreenHeader: FC<Props> = ({ title, onBack }) => {
  const { row } = useI18n();
  return (
    <View style={[styles.row, { flexDirection: row }]}>
      <View style={styles.side}>{onBack ? <BackButton onPress={onBack} /> : null}</View>
      <TextCustom style={styles.title} accessibilityRole="header">
        {title}
      </TextCustom>
      <View style={styles.side} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  side: {
    width: BACK_SIZE,
  },
  back: {
    width: BACK_SIZE,
    height: BACK_SIZE,
    borderRadius: BACK_SIZE / 2,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.semiBold,
    fontSize: 17,
  },
});
