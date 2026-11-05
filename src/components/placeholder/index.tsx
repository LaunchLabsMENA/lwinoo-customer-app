import { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../assets/colors';
import { HeadingText, TextCustom } from '../react-native';
import { useI18n } from '../../i18n';

type Props = {
  title: string;
  children?: ReactNode;
};

// Temporary screen body for tabs that haven't been designed yet.
export const Placeholder: FC<Props> = ({ title, children }) => {
  const { t } = useI18n();
  return (
    <View style={styles.container}>
      <HeadingText>{title}</HeadingText>
      <TextCustom style={styles.text}>{t('common.comingSoon')}</TextCustom>
      {children}
    </View>
  );
};

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
