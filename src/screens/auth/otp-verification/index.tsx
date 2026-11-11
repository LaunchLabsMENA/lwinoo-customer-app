import { FC, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Mail, Smartphone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { ScreenHeader } from '../../../components/screen-header';
import { OtpInput } from '../../../components/otp-input';
import { PrimaryButton } from '../../../components/primary-button';
import { ltr, useI18n } from '../../../i18n';
import { requestOtp, verifyOtp } from '../../../api/auth';
import { errorMessage, retryAfterSeconds } from '../../../api/errors';
import { routeForStep } from '../../../navigation/bootstrap';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

const CODE_LENGTH = 4;
const RESEND_SECONDS = 60;

export const OtpVerificationScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const isEmail = route.params.method === 'email';
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const onChangeCode = (value: string) => {
    setCode(value);
    setError('');
  };

  const onVerify = async () => {
    if (loading || code.length < CODE_LENGTH) return;
    setLoading(true);
    try {
      const session = await verifyOtp(
        route.params.flow,
        route.params.method,
        route.params.target,
        code,
      );
      navigation.reset({
        index: 0,
        routes: [{ name: routeForStep(session.user.onboardingStep) }],
      });
    } catch (failure) {
      setCode('');
      setError(errorMessage(failure, t));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError('');
    try {
      const sent = await requestOtp(
        route.params.flow,
        route.params.method,
        route.params.target,
      );
      setSeconds(sent.resendAfter);
    } catch (failure) {
      const wait = retryAfterSeconds(failure);
      if (wait) setSeconds(Math.min(wait, RESEND_SECONDS));
      setError(errorMessage(failure, t));
    }
  };

  const countdown = `${Math.floor(seconds / 60)}:${String(
    seconds % 60,
  ).padStart(2, '0')}`;
  const ready = code.length === CODE_LENGTH;
  const Icon = isEmail ? Mail : Smartphone;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title={t('otp.header')} onBack={navigation.goBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.badge}>
          <View style={styles.badgeInner}>
            <Icon size={30} color={COLORS.brandDeep} strokeWidth={1.75} />
          </View>
        </View>

        <HeadingText style={styles.title}>
          {t(isEmail ? 'otp.titleEmail' : 'otp.titlePhone')}
        </HeadingText>
        <TextCustom style={styles.subtitle}>
          {t(isEmail ? 'otp.sentEmail' : 'otp.sentPhone', {
            count: CODE_LENGTH,
          })}
        </TextCustom>

        <View style={[styles.targetChip, { flexDirection: row }]}>
          <TextCustom style={styles.target} numberOfLines={1}>
            {ltr(route.params.target)}
          </TextCustom>
          <Pressable
            onPress={navigation.goBack}
            hitSlop={10}
            accessibilityRole="button"
          >
            <TextCustom style={styles.change}>{t('otp.change')}</TextCustom>
          </Pressable>
        </View>

        <OtpInput
          length={CODE_LENGTH}
          value={code}
          onChange={onChangeCode}
          error={!!error}
        />
        {error ? (
          <TextCustom style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </TextCustom>
        ) : null}

        <View style={[styles.resendRow, { flexDirection: row }]}>
          <TextCustom style={styles.resendText}>{t('otp.noCode')}</TextCustom>
          {seconds > 0 ? (
            <TextCustom style={styles.resendBold}>
              {t('otp.resendIn', { seconds: ltr(countdown) })}
            </TextCustom>
          ) : (
            <Pressable
              onPress={onResend}
              hitSlop={8}
              accessibilityRole="button"
            >
              <TextCustom style={[styles.resendBold, styles.resendLink]}>
                {t('otp.resend')}
              </TextCustom>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <PrimaryButton
          title={t('otp.verify')}
          disabled={!ready}
          loading={loading}
          onPress={onVerify}
          style={!ready && styles.buttonIdle}
        />
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
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  badgeInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.inkMuted,
  },
  targetChip: {
    maxWidth: '100%',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    marginBottom: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  target: {
    flexShrink: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  change: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.brandDeep,
  },
  error: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.error,
  },
  resendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.inkMuted,
  },
  resendBold: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  resendLink: {
    color: COLORS.brandDeep,
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.white,
  },
  // Soft rose until the code is complete, then the regular dark button.
  buttonIdle: {
    backgroundColor: COLORS.brand,
  },
});
