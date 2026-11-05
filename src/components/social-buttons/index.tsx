import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';
import { AppleIcon, GoogleIcon } from '../icons';
import { useI18n } from '../../i18n';

type Props = {
  onGoogle?: () => void;
  onApple?: () => void;
};

export const SocialButtons: FC<Props> = ({ onGoogle, onApple }) => {
  const { t } = useI18n();
  return (
  <View>
    <View style={styles.dividerRow}>
      <View style={styles.line} />
      <TextCustom style={styles.dividerText}>{t('social.orContinueWith')}</TextCustom>
      <View style={styles.line} />
    </View>
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={onGoogle}>
        <GoogleIcon />
        <TextCustom style={styles.label}>Google</TextCustom>
      </Pressable>
      <Pressable style={styles.button} onPress={onApple}>
        <AppleIcon color={COLORS.ink} />
        <TextCustom style={styles.label}>Apple</TextCustom>
      </Pressable>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
});
