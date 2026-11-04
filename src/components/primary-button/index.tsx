import { FC } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const PrimaryButton: FC<Props> = ({ title, onPress, disabled, style }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dimmed, style]}
  >
    <TextCustom style={styles.title}>{title}</TextCustom>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: {
    opacity: 0.7,
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.white,
  },
});
