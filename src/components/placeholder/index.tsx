import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../assets/colors';
import { HeadingText, TextCustom } from '../react-native';

type Props = {
  title: string;
};

// Temporary screen body for tabs that haven't been designed yet.
export const Placeholder: FC<Props> = ({ title }) => (
  <View style={styles.container}>
    <HeadingText>{title}</HeadingText>
    <TextCustom style={styles.text}>Coming soon</TextCustom>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  text: {
    marginTop: 8,
    color: COLORS.inkMuted,
  },
});
