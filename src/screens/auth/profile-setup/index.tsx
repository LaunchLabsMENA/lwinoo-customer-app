import { FC, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDays, Camera, Info, Plus, Sparkles, Star, User } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { ScreenHeader } from '../../../components/screen-header';
import { StepProgress } from '../../../components/step-progress';
import { FormInput, RequiredChip } from '../../../components/form-input';
import { PrimaryButton } from '../../../components/primary-button';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

const TITLES = ['Miss', 'Mrs.', 'Dr.'];

export const ProfileSetupScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Noura Al-Rashidi');
  const [title, setTitle] = useState(TITLES[0]);
  const [dob, setDob] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Profile" onBack={navigation.goBack} />
      <StepProgress step={2} total={4} label="Location" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <HeadingText style={styles.heading}>Setup your profile</HeadingText>

        <View style={styles.photoWrap}>
          <Pressable style={styles.photo}>
            <Camera size={26} color={COLORS.inkMuted} strokeWidth={1.5} />
            <View style={styles.photoBadge}>
              <Plus size={14} color={COLORS.white} />
            </View>
          </Pressable>
          <TextCustom style={styles.photoText}>
            Add a profile photo <TextCustom style={styles.optional}>(Optional)</TextCustom>
          </TextCustom>
        </View>

        <FormInput
          label="Full Name"
          uppercaseLabel
          labelRight={<RequiredChip />}
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          left={<User size={18} color={COLORS.brand} />}
        />

        <TextCustom style={styles.sectionLabel}>Preferred Title</TextCustom>
        <View style={styles.titles}>
          {TITLES.map(t => {
            const active = t === title;
            return (
              <Pressable key={t} onPress={() => setTitle(t)} style={[styles.titleChip, active && styles.titleChipActive]}>
                <TextCustom style={[styles.titleText, active && styles.titleTextActive]}>{t}</TextCustom>
              </Pressable>
            );
          })}
        </View>

        <FormInput
          containerStyle={styles.dob}
          label="Date of Birth"
          uppercaseLabel
          labelRight={
            <View style={styles.vip}>
              <Star size={11} color={COLORS.brandDeep} fill={COLORS.brandDeep} />
              <TextCustom style={styles.vipText}>VIP Perk</TextCustom>
            </View>
          }
          value={dob}
          onChangeText={setDob}
          placeholder="DD / MM / YYYY (Optional)"
          keyboardType="number-pad"
          left={<CalendarDays size={18} color={COLORS.brand} />}
        />

        <View style={styles.perk}>
          <Sparkles size={14} color={COLORS.brandDeep} />
          <TextCustom style={styles.perkText}>
            Add your birthdate to unlock an exclusive complimentary birthday styling package every year.
          </TextCustom>
        </View>

        <View style={styles.note}>
          <Info size={13} color={COLORS.brandDeep} />
          <TextCustom style={styles.noteText}>Your profile remains confidential for private concierge bookings.</TextCustom>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <PrimaryButton title="Continue" disabled={!name.trim()} onPress={() => navigation.navigate('MapPin')} />
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
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heading: {
    marginTop: 24,
    textAlign: 'center',
  },
  photoWrap: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.brand,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBadge: {
    position: 'absolute',
    right: 2,
    bottom: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.darkBrown,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  optional: {
    fontSize: 12,
    color: COLORS.placeholder,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  titles: {
    flexDirection: 'row',
    gap: 10,
  },
  titleChip: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleChipActive: {
    backgroundColor: COLORS.darkBrown,
    borderColor: COLORS.darkBrown,
  },
  titleText: {
    fontSize: 14,
    color: COLORS.inkMuted,
  },
  titleTextActive: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  dob: {
    marginTop: 20,
  },
  vip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vipText: {
    fontSize: 11,
    color: COLORS.brandDeep,
  },
  perk: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.brandSoft,
  },
  perkText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  note: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
  },
  noteText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.white,
  },
});
