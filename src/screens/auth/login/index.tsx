import { FC, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, X } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { SegmentedTabs } from '../../../components/segmented-tabs';
import { FormInput } from '../../../components/form-input';
import { PrimaryButton } from '../../../components/primary-button';
import { SocialButtons } from '../../../components/social-buttons';
import { LanguageToggle } from '../../../components/language-toggle';
import { CountryPicker } from '../../../components/country-picker';
import { ltr, useI18n } from '../../../i18n';
import { requestOtp } from '../../../api/auth';
import { errorMessage } from '../../../api/errors';
import { useSession } from '../../../store/session';
import {
  Country,
  countryName,
  DEFAULT_COUNTRY,
} from '../../../utils/countries';
import {
  isValidEmail,
  isValidPhone,
  normalizeEmail,
  toE164,
  toPhoneDigits,
} from '../../../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type Method = 'phone' | 'email';

export const LoginScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row, locale, isRTL } = useI18n();
  const tabs: { key: Method; label: string }[] = [
    { key: 'phone', label: t('login.tabPhone') },
    { key: 'email', label: t('login.tabEmail') },
  ];
  const [signingUp, setSigningUp] = useState(route.params?.mode === 'signup');
  // Opened from a guest sign-in prompt: the guest's screen is still underneath.
  const canClose = navigation.canGoBack();
  const [method, setMethod] = useState<Method>('phone');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhone = (): string => {
    if (!phone) return t('login.phoneRequired');
    if (isValidPhone(country, phone)) return '';
    return country.code === 'SA'
      ? t('login.invalidPhoneSA')
      : t('login.invalidPhone', { country: countryName(country, locale) });
  };

  const validateEmail = (value: string): string => {
    if (!value) return t('login.emailRequired');
    return isValidEmail(value) ? '' : t('login.invalidEmail');
  };

  const onContinue = async () => {
    if (loading) return;
    const target =
      method === 'phone' ? toE164(country, phone) : normalizeEmail(email);
    const message =
      method === 'phone' ? validatePhone() : validateEmail(target);
    if (message) return setError(message);
    const flow = signingUp ? 'signup' : 'login';
    setLoading(true);
    try {
      await requestOtp(flow, method, target);
      navigation.navigate('OtpVerification', { flow, method, target });
    } catch (failure) {
      setError(errorMessage(failure, t));
    } finally {
      setLoading(false);
    }
  };

  const onChangeMethod = (next: Method) => {
    setMethod(next);
    setError('');
  };

  const onToggleSignUp = () => {
    setSigningUp(current => !current);
    setError('');
  };

  // Local only, like Ora: no server call. Guests browse freely; protected actions ask them to sign in.
  const onContinueAsGuest = () => {
    useSession.getState().enterGuest();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const onSelectCountry = (next: Country) => {
    setCountry(next);
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {canClose ? (
        <Pressable
          style={[styles.close, { top: insets.top + 12 }]}
          onPress={navigation.goBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t('login.close')}
        >
          <X size={22} color={COLORS.ink} />
        </Pressable>
      ) : null}
      <LanguageToggle style={[styles.toggle, { top: insets.top + 12 }]} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.main}>
          <HeadingText style={styles.title}>
            {t(signingUp ? 'login.signUpTitle' : 'login.title')}
          </HeadingText>
          <TextCustom style={styles.subtitle}>{t('login.subtitle')}</TextCustom>

          <SegmentedTabs
            options={tabs}
            value={method}
            onChange={onChangeMethod}
          />

          {method === 'phone' ? (
            <FormInput
              containerStyle={styles.field}
              label={t('login.mobileNumber')}
              placeholder={
                country.code === 'SA'
                  ? '5X XXX XXXX'
                  : t('login.phonePlaceholder')
              }
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              // Room for a leading trunk "0" some users type.
              maxLength={country.maxLength + 1}
              value={phone}
              onChangeText={text => {
                setPhone(toPhoneDigits(text));
                setError('');
              }}
              onSubmitEditing={onContinue}
              error={error}
              ltr
              left={
                <Pressable
                  style={[
                    styles.country,
                    isRTL ? styles.countryRtl : styles.countryLtr,
                    { flexDirection: row },
                  ]}
                  onPress={() => setPickerOpen(true)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={t('login.selectCountry')}
                >
                  <TextCustom style={styles.flag}>{country.flag}</TextCustom>
                  <TextCustom>{ltr(`+${country.dial}`)}</TextCustom>
                  <ChevronDown size={14} color={COLORS.ink} />
                </Pressable>
              }
            />
          ) : (
            <FormInput
              containerStyle={styles.field}
              label={t('login.email')}
              placeholder="name@lwinoo.sa"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={254}
              value={email}
              onChangeText={text => {
                setEmail(text);
                setError('');
              }}
              onSubmitEditing={onContinue}
              error={error}
              ltr
            />
          )}

          <PrimaryButton
            title={t('common.continue')}
            onPress={onContinue}
            loading={loading}
            style={styles.button}
          />

          <SocialButtons
            onGoogle={() => Alert.alert(t('login.socialSoon'))}
            onApple={() => Alert.alert(t('login.socialSoon'))}
          />

          <Pressable
            style={({ pressed }) => [
              styles.guestCta,
              pressed && styles.pressed,
            ]}
            onPress={onContinueAsGuest}
            accessibilityRole="button"
            accessibilityHint={t('login.guestHint')}
          >
            <TextCustom style={styles.guestCtaText}>
              {t('login.guestCta')}
            </TextCustom>
          </Pressable>
          <TextCustom style={styles.guestHint}>
            {t('login.guestHint')}
          </TextCustom>
        </View>

        <View style={[styles.switchRow, { flexDirection: row }]}>
          <TextCustom style={styles.switchText}>
            {t(signingUp ? 'login.haveAccount' : 'login.noAccount')}
          </TextCustom>
          <Pressable
            onPress={onToggleSignUp}
            hitSlop={8}
            accessibilityRole="button"
          >
            <TextCustom style={styles.switchLink}>
              {t(signingUp ? 'login.signIn' : 'login.createAccount')}
            </TextCustom>
          </Pressable>
        </View>
      </ScrollView>

      <CountryPicker
        visible={pickerOpen}
        selectedCode={country.code}
        onSelect={onSelectCountry}
        onClose={() => setPickerOpen(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  toggle: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  close: {
    position: 'absolute',
    zIndex: 1,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    // The language toggle is pinned right in both directions, so close stays left.
    left: 16,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  // Form fills the space and stays centred; the login/sign-up switch is pinned to the bottom.
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 48,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.inkMuted,
  },
  field: {
    marginTop: 20,
  },
  country: {
    alignItems: 'center',
    gap: 6,
    height: 28,
    borderColor: COLORS.border,
  },
  // Divider sits between the code and the number on whichever side that is.
  countryLtr: {
    paddingRight: 10,
    borderRightWidth: 1,
  },
  countryRtl: {
    paddingLeft: 10,
    borderLeftWidth: 1,
  },
  flag: {
    fontSize: 18,
  },
  button: {
    marginTop: 24,
    marginBottom: 28,
  },
  guestCta: {
    marginTop: 24,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  guestCtaText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  guestHint: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.inkMuted,
  },
  switchRow: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  switchText: {
    fontSize: 15,
    color: COLORS.inkMuted,
  },
  switchLink: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.brandDeep,
  },
});
