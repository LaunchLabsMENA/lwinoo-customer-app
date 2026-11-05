import { FC, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { SegmentedTabs } from '../../../components/segmented-tabs';
import { FormInput } from '../../../components/form-input';
import { PrimaryButton } from '../../../components/primary-button';
import { SocialButtons } from '../../../components/social-buttons';
import { LanguageToggle } from '../../../components/language-toggle';
import { CountryPicker } from '../../../components/country-picker';
import { ltr, useI18n } from '../../../i18n';
import { Country, countryName, DEFAULT_COUNTRY } from '../../../utils/countries';
import { isValidEmail, isValidPhone, normalizeEmail, toE164, toPhoneDigits } from '../../../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type Method = 'phone' | 'email';

export const LoginScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { t, row, locale, isRTL } = useI18n();
  const tabs: { key: Method; label: string }[] = [
    { key: 'phone', label: t('login.tabPhone') },
    { key: 'email', label: t('login.tabEmail') },
  ];
  const [method, setMethod] = useState<Method>('phone');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

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

  const onContinue = () => {
    if (method === 'phone') {
      const message = validatePhone();
      if (message) return setError(message);
      navigation.navigate('OtpVerification', { method, target: toE164(country, phone) });
    } else {
      const normalized = normalizeEmail(email);
      const message = validateEmail(normalized);
      if (message) return setError(message);
      navigation.navigate('OtpVerification', { method, target: normalized });
    }
  };

  const onChangeMethod = (next: Method) => {
    setMethod(next);
    setError('');
  };

  const onSelectCountry = (next: Country) => {
    setCountry(next);
    setError('');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LanguageToggle style={[styles.toggle, { top: insets.top + 12 }]} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <HeadingText style={styles.title}>{t('login.title')}</HeadingText>
        <TextCustom style={styles.subtitle}>{t('login.subtitle')}</TextCustom>

        <SegmentedTabs options={tabs} value={method} onChange={onChangeMethod} />

        {method === 'phone' ? (
          <FormInput
            containerStyle={styles.field}
            label={t('login.mobileNumber')}
            placeholder={country.code === 'SA' ? '5X XXX XXXX' : t('login.phonePlaceholder')}
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
                style={[styles.country, isRTL ? styles.countryRtl : styles.countryLtr, { flexDirection: row }]}
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
            placeholder="yourmail@gmail.com"
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

        <PrimaryButton title={t('common.continue')} onPress={onContinue} style={styles.button} />

        <SocialButtons
          onGoogle={() => navigation.navigate('ProfileSetup')}
          onApple={() => navigation.navigate('ProfileSetup')}
        />
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
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
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
});
