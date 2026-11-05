import { FC, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { ScreenHeader } from '../../../components/screen-header';
import { OtpInput } from '../../../components/otp-input';
import { PrimaryButton } from '../../../components/primary-button';
import { useI18n } from '../../../i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

const CODE_LENGTH = 4;
const RESEND_SECONDS = 11;

export const OtpVerificationScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const isEmail = route.params.method === 'email';
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title={t('otp.header')} onBack={navigation.goBack} />
      <View style={styles.content}>
        <HeadingText style={styles.title}>{t(isEmail ? 'otp.titleEmail' : 'otp.titlePhone')}</HeadingText>
        <TextCustom style={styles.subtitle}>
          {t(isEmail ? 'otp.sentEmail' : 'otp.sentPhone', { count: CODE_LENGTH })}
        </TextCustom>

        <OtpInput length={CODE_LENGTH} value={code} onChange={setCode} />

        <PrimaryButton
          title={t('otp.verify')}
          disabled={code.length < CODE_LENGTH}
          onPress={() => navigation.navigate('ProfileSetup')}
          style={styles.button}
        />

        <View style={[styles.resendRow, { flexDirection: row }]}>
          <TextCustom style={styles.resendText}>{t('otp.noCode')}</TextCustom>
          {seconds > 0 ? (
            <TextCustom style={styles.resendBold}>{t('otp.resendIn', { seconds })}</TextCustom>
          ) : (
            <Pressable onPress={() => setSeconds(RESEND_SECONDS)} hitSlop={8}>
              <TextCustom style={[styles.resendBold, styles.resendLink]}>{t('otp.resend')}</TextCustom>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.inkMuted,
  },
  button: {
    marginTop: 28,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 13,
    color: COLORS.inkMuted,
  },
  resendBold: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  resendLink: {
    color: COLORS.brandDeep,
  },
});
