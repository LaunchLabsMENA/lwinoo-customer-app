import { FC, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDays, Camera, Info, Plus, Sparkles, Star, User } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { ScreenHeader } from '../../../components/screen-header';
import { StepProgress } from '../../../components/step-progress';
import { FormInput, RequiredChip } from '../../../components/form-input';
import { PrimaryButton } from '../../../components/primary-button';
import { useI18n, type TranslationKey } from '../../../i18n';
import { saveProfile, uploadAvatar } from '../../../api/customer';
import { errorMessage } from '../../../api/errors';
import { logout } from '../../../api/auth';
import type { Title } from '../../../api/types';
import { useSession } from '../../../store/session';
import { formatDobInput, isoToDob, parseDob } from '../../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

const TITLES: { code: Title; key: TranslationKey }[] = [
  { code: 'MISS', key: 'profileSetup.title.miss' },
  { code: 'MRS', key: 'profileSetup.title.mrs' },
  { code: 'DR', key: 'profileSetup.title.dr' },
];

const IMAGE_TYPES = ['image/jpeg', 'image/png'];

type Photo = { uri: string; type: string };

export const ProfileSetupScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const editing = route.params?.mode === 'edit';
  const existing = useSession(state => state.me?.profile ?? null);

  const [name, setName] = useState(existing?.displayName ?? '');
  const [title, setTitle] = useState<Title | null>(existing?.title ?? null);
  const [dob, setDob] = useState(isoToDob(existing?.dateOfBirth));
  const [avatarUrl, setAvatarUrl] = useState<string | null>(existing?.avatarUrl ?? null);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [nameError, setNameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const shownPhoto = photo?.uri ?? avatarUrl;

  const pick = async (source: 'camera' | 'library') => {
    const launch = source === 'camera' ? launchCamera : launchImageLibrary;
    const result = await launch({ mediaType: 'photo', quality: 0.8, maxWidth: 1024, maxHeight: 1024, selectionLimit: 1 });
    const asset = result.assets?.[0];
    if (asset?.uri) {
      setPhoto({ uri: asset.uri, type: asset.type && IMAGE_TYPES.includes(asset.type) ? asset.type : 'image/jpeg' });
    }
  };

  const onPhotoPress = () => {
    const buttons = [
      { text: t('profileSetup.photoCamera'), onPress: () => pick('camera') },
      { text: t('profileSetup.photoLibrary'), onPress: () => pick('library') },
      ...(shownPhoto
        ? [
            {
              text: t('profileSetup.photoRemove'),
              style: 'destructive' as const,
              onPress: () => {
                setPhoto(null);
                setAvatarUrl(null);
              },
            },
          ]
        : []),
      { text: t('common.cancel'), style: 'cancel' as const },
    ];
    Alert.alert(t('profileSetup.addPhoto'), undefined, buttons);
  };

  const onSubmit = async () => {
    if (loading) return;
    const trimmed = name.trim();
    const parsed = parseDob(dob);
    setNameError(trimmed.length < 2 ? t('profileSetup.nameRequired') : '');
    setDobError(parsed.valid ? '' : t('profileSetup.invalidDob'));
    setFormError('');
    if (trimmed.length < 2 || !parsed.valid) return;

    setLoading(true);
    try {
      const photoRemoved = !photo && !avatarUrl && !!existing?.avatarUrl;
      const avatarFileId = photo ? await uploadAvatar(photo.uri, photo.type) : photoRemoved ? null : undefined;
      await saveProfile({ fullName: trimmed, title, dateOfBirth: parsed.iso, avatarFileId });
      if (editing) navigation.goBack();
      else navigation.navigate('Permissions');
    } catch (failure) {
      setFormError(errorMessage(failure, t));
    } finally {
      setLoading(false);
    }
  };

  // Onboarding starts a fresh stack after OTP, so there is no screen behind this one.
  // Going back then means leaving setup: confirm, sign out, and the session watcher returns to Login.
  const onBack = () => {
    if (navigation.canGoBack()) return navigation.goBack();
    Alert.alert(t('account.logoutTitle'), t('account.logoutBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('account.logout'), style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title={t(editing ? 'profileSetup.editHeader' : 'profileSetup.header')}
        onBack={onBack}
      />
      {editing ? null : <StepProgress step={2} total={4} label={t('step.location')} />}

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {editing ? null : <HeadingText style={styles.heading}>{t('profileSetup.heading')}</HeadingText>}

        <View style={styles.photoWrap}>
          <Pressable style={styles.photo} onPress={onPhotoPress} accessibilityRole="button" accessibilityLabel={t('profileSetup.addPhoto')}>
            {shownPhoto ? (
              <Image source={{ uri: shownPhoto }} style={styles.photoImage} />
            ) : (
              <Camera size={26} color={COLORS.inkMuted} strokeWidth={1.5} />
            )}
            <View style={styles.photoBadge}>
              <Plus size={14} color={COLORS.white} />
            </View>
          </Pressable>
          <TextCustom style={styles.photoText}>
            {`${t('profileSetup.addPhoto')} `}
            <TextCustom style={styles.optional}>{t('profileSetup.optional')}</TextCustom>
          </TextCustom>
        </View>

        <FormInput
          label={t('profileSetup.fullName')}
          uppercaseLabel
          labelRight={<RequiredChip />}
          value={name}
          onChangeText={text => {
            setName(text);
            setNameError('');
          }}
          placeholder={t('profileSetup.namePlaceholder')}
          maxLength={60}
          error={nameError}
          left={<User size={18} color={COLORS.brand} />}
        />

        <TextCustom style={styles.sectionLabel}>{t('profileSetup.preferredTitle')}</TextCustom>
        <View style={[styles.titles, { flexDirection: row }]}>
          {TITLES.map(option => {
            const active = option.code === title;
            return (
              <Pressable
                key={option.code}
                onPress={() => setTitle(active ? null : option.code)}
                style={[styles.titleChip, active && styles.titleChipActive]}
              >
                <TextCustom style={[styles.titleText, active && styles.titleTextActive]}>{t(option.key)}</TextCustom>
              </Pressable>
            );
          })}
        </View>

        <FormInput
          containerStyle={styles.dob}
          label={t('profileSetup.dob')}
          uppercaseLabel
          labelRight={
            <View style={[styles.vip, { flexDirection: row }]}>
              <Star size={11} color={COLORS.brandDeep} fill={COLORS.brandDeep} />
              <TextCustom style={styles.vipText}>{t('profileSetup.vipPerk')}</TextCustom>
            </View>
          }
          value={dob}
          onChangeText={text => {
            setDob(formatDobInput(text));
            setDobError('');
          }}
          placeholder={t('profileSetup.dobPlaceholder')}
          keyboardType="number-pad"
          maxLength={14}
          error={dobError}
          ltr
          left={<CalendarDays size={18} color={COLORS.brand} />}
        />

        <View style={[styles.perk, { flexDirection: row }]}>
          <Sparkles size={14} color={COLORS.brandDeep} />
          <TextCustom style={styles.perkText}>{t('profileSetup.birthdayPerk')}</TextCustom>
        </View>

        <View style={[styles.note, { flexDirection: row }]}>
          <Info size={13} color={COLORS.brandDeep} />
          <TextCustom style={styles.noteText}>{t('profileSetup.confidential')}</TextCustom>
        </View>

        {formError ? <TextCustom style={styles.formError}>{formError}</TextCustom> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <PrimaryButton
          title={editing ? t('profileSetup.save') : t('common.continue')}
          disabled={!name.trim()}
          loading={loading}
          onPress={onSubmit}
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
  photoImage: {
    width: 93,
    height: 93,
    borderRadius: 47,
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
  formError: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.error,
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
