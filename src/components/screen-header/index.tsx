import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';

type Props = {
  title: string;
  onBack?: () => void;
};

export const ScreenHeader: FC<Props> = ({ title, onBack }) => (
  <View style={styles.row}>
    <Pressable onPress={onBack} hitSlop={12} style={styles.side}>
      {onBack ? <ArrowLeft size={22} color={COLORS.ink} /> : null}
    </Pressable>
    <TextCustom style={styles.title}>{title}</TextCustom>
    <View style={styles.side} />
  </View>
);

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
