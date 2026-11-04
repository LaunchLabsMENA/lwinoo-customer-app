import { FC, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type Method = 'phone' | 'email';

const TABS: { key: Method; label: string }[] = [
  { key: 'phone', label: 'Phone Number' },
  { key: 'email', label: 'Email' },
];

export const LoginScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState<Method>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const onContinue = () => {
    navigation.navigate('OtpVerification', {
      method,
      target: method === 'phone' ? `+966 ${phone}` : email,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <HeadingText style={styles.title}>Login to Account</HeadingText>
        <TextCustom style={styles.subtitle}>Join thousands of women discovering beauty & style</TextCustom>

        <SegmentedTabs options={TABS} value={method} onChange={setMethod} />

        {method === 'phone' ? (
          <FormInput
            containerStyle={styles.field}
            label="Mobile Number"
            placeholder="5X XXX XXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            left={
              <View style={styles.country}>
                <TextCustom style={styles.flag}>🇸🇦</TextCustom>
                <ChevronDown size={14} color={COLORS.ink} />
                <TextCustom>+966</TextCustom>
              </View>
            }
          />
        ) : (
          <FormInput
            containerStyle={styles.field}
            label="Email"
            placeholder="yourmail@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        )}

        <PrimaryButton title="Continue" onPress={onContinue} style={styles.button} />

        <SocialButtons
          onGoogle={() => navigation.navigate('ProfileSetup')}
          onApple={() => navigation.navigate('ProfileSetup')}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: {
    fontSize: 18,
  },
  button: {
    marginTop: 24,
    marginBottom: 28,
  },
});
