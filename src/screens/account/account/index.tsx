import { FC } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, ChevronRight, Heart, LogIn, LogOut, MapPin, User, type LucideIcon } from 'lucide-react-native';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { LanguageToggle } from '../../../components/language-toggle';
import { useI18n, ltr } from '../../../i18n';
import { logout } from '../../../api/auth';
import { useSession } from '../../../store/session';
import { PrimaryButton } from '../../../components/primary-button';
import { openLogin } from '../../../components/auth-gate';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

type RowProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
};

const MenuRow: FC<RowProps> = ({ icon: Icon, label, onPress }) => {
  const { row, isRTL } = useI18n();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;
  return (
    <Pressable onPress={onPress} style={[styles.menuRow, { flexDirection: row }]} accessibilityRole="button">
      <Icon size={20} color={COLORS.brandDeep} />
      <TextCustom style={styles.menuLabel}>{label}</TextCustom>
      <Chevron size={18} color={COLORS.inkMuted} />
    </Pressable>
  );
};

export const AccountScreen: FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Navigation>();
  const { t, row } = useI18n();
  const me = useSession(state => state.me);
  const isGuest = useSession(state => state.isGuest && !state.tokens);

  const name = me?.profile?.displayName ?? t('account.guestName');
  const contact = me?.phone ? ltr(me.phone) : me?.email ?? '';

  const confirmLogout = () =>
    Alert.alert(t('account.logoutTitle'), t('account.logoutBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('account.logout'), style: 'destructive', onPress: () => logout() },
    ]);

  if (isGuest) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 120 }]}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <User size={34} color={COLORS.inkMuted} strokeWidth={1.5} />
          </View>
          <HeadingText style={styles.name}>{t('account.guestTitle')}</HeadingText>
          <TextCustom style={styles.contact}>{t('account.browsingAsGuest')}</TextCustom>
        </View>

        <View style={styles.guestCard}>
          <HeadingText style={styles.guestCardTitle}>{t('account.guestCardTitle')}</HeadingText>
          <TextCustom style={styles.guestCardBody}>{t('account.guestCardBody')}</TextCustom>
          <PrimaryButton title={t('account.signIn')} onPress={() => openLogin('signup')} style={styles.guestCardButton} />
        </View>

        <TextCustom style={styles.section}>{t('account.section.app')}</TextCustom>
        <View style={styles.card}>
          <View style={[styles.menuRow, { flexDirection: row }]}>
            <TextCustom style={styles.menuLabel}>{t('account.language')}</TextCustom>
            <LanguageToggle />
          </View>
          <MenuRow icon={LogIn} label={t('guestSignIn.login')} onPress={() => openLogin('login')} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 120 }]}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          {me?.profile?.avatarUrl ? (
            <Image source={{ uri: me.profile.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <User size={34} color={COLORS.inkMuted} strokeWidth={1.5} />
          )}
        </View>
        <HeadingText style={styles.name}>{name}</HeadingText>
        {contact ? <TextCustom style={styles.contact}>{contact}</TextCustom> : null}
      </View>

      <TextCustom style={styles.section}>{t('account.section.profile')}</TextCustom>
      <View style={styles.card}>
        <MenuRow icon={User} label={t('account.editProfile')} onPress={() => navigation.navigate('ProfileSetup', { mode: 'edit' })} />
        <MenuRow icon={MapPin} label={t('account.addresses')} onPress={() => navigation.navigate('Addresses')} />
        <MenuRow icon={Heart} label={t('account.interests')} onPress={() => navigation.navigate('Preferences', { mode: 'edit' })} />
      </View>

      <TextCustom style={styles.section}>{t('account.section.app')}</TextCustom>
      <View style={styles.card}>
        <View style={[styles.menuRow, { flexDirection: row }]}>
          <TextCustom style={styles.menuLabel}>{t('account.language')}</TextCustom>
          <LanguageToggle />
        </View>
        <MenuRow icon={LogOut} label={t('account.logout')} onPress={confirmLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 88,
    height: 88,
  },
  name: {
    marginTop: 12,
    fontSize: 22,
  },
  contact: {
    marginTop: 4,
    color: COLORS.inkMuted,
  },
  section: {
    marginTop: 12,
    marginBottom: 8,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: COLORS.inkMuted,
  },
  card: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 54,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.hairline,
  },
  guestCard: {
    marginBottom: 12,
    padding: 18,
    borderRadius: 16,
    backgroundColor: COLORS.brandSoft,
  },
  guestCardTitle: {
    fontSize: 18,
  },
  guestCardBody: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.inkMuted,
  },
  guestCardButton: {
    marginTop: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
  },
});
