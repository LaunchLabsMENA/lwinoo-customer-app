import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';
import { useI18n } from '../../i18n';

type Props = {
  title: string;
  onBack?: () => void;
};

export const ScreenHeader: FC<Props> = ({ title, onBack }) => {
  const { isRTL, row } = useI18n();
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  return (
    <View style={[styles.row, { flexDirection: row }]}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.side}>
        {onBack ? <BackIcon size={22} color={COLORS.ink} /> : null}
      </Pressable>
      <TextCustom style={styles.title}>{title}</TextCustom>
      <View style={styles.side} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  side: {
    width: 32,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.semiBold,
    fontSize: 17,
  },
});
