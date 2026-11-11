import { FC } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const PrimaryButton: FC<Props> = ({ title, onPress, disabled, loading, style }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    style={({ pressed }) => [styles.button, (pressed || disabled || loading) && styles.dimmed, style]}
  >
    {loading ? <ActivityIndicator color={COLORS.white} /> : <TextCustom style={styles.title}>{title}</TextCustom>}
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
