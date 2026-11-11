import { FC, useCallback, useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Check, MapPin, type LucideIcon } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { ScreenHeader } from '../../../components/screen-header';
import { StepProgress } from '../../../components/step-progress';
import { PrimaryButton } from '../../../components/primary-button';
import { useI18n, type TranslationKey } from '../../../i18n';
import {
  askLocation,
  askNotifications,
  locationAccess,
  notificationAccess,
  openAppSettings,
  type Access,
} from '../../../utils/permissions';

type Props = NativeStackScreenProps<RootStackParamList, 'Permissions'>;

type CardProps = {
  icon: LucideIcon;
  title: TranslationKey;
  body: TranslationKey;
  access: Access;
  onAllow: () => void;
};

const PermissionCard: FC<CardProps> = ({ icon: Icon, title, body, access, onAllow }) => {
  const { t, row } = useI18n();
  const granted = access === 'granted';
  const blocked = access === 'blocked';
  return (
    <View style={[styles.card, { flexDirection: row }]}>
      <View style={styles.iconWrap}>
        <Icon size={22} color={COLORS.brandDeep} />
      </View>
      <View style={styles.cardBody}>
        <TextCustom style={styles.cardTitle}>{t(title)}</TextCustom>
        <TextCustom style={styles.cardText}>{t(body)}</TextCustom>
      </View>
      {granted ? (
        <View style={[styles.allowed, { flexDirection: row }]}>
          <Check size={14} color={COLORS.success} strokeWidth={3} />
          <TextCustom style={styles.allowedText}>{t('permissions.allowed')}</TextCustom>
        </View>
      ) : access === 'unavailable' ? null : (
        <Pressable onPress={blocked ? openAppSettings : onAllow} style={styles.allow} hitSlop={6}>
          <TextCustom style={styles.allowText}>{t(blocked ? 'permissions.openSettings' : 'permissions.allow')}</TextCustom>
        </Pressable>
      )}
    </View>
  );
};

export const PermissionsScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const [location, setLocation] = useState<Access>('denied');
  const [notifications, setNotifications] = useState<Access>('denied');

  const refresh = useCallback(async () => {
    const [nextLocation, nextNotifications] = await Promise.all([locationAccess(), notificationAccess()]);
    setLocation(nextLocation);
    setNotifications(nextNotifications);
  }, []);

  useEffect(() => {
    refresh().catch(() => {});
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') refresh().catch(() => {});
    });
    return () => subscription.remove();
  }, [refresh]);

  const next = () => navigation.navigate('MapPin', { mode: 'onboarding' });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title={t('permissions.header')} />
      <StepProgress step={3} total={4} label={t('step.location')} />
      <View style={styles.content}>
        <HeadingText style={styles.heading}>{t('permissions.heading')}</HeadingText>
        <TextCustom style={styles.subtitle}>{t('permissions.body')}</TextCustom>
        <PermissionCard
          icon={MapPin}
          title="permissions.location.title"
          body="permissions.location.body"
          access={location}
          onAllow={() => askLocation().then(setLocation).catch(() => {})}
        />
        <PermissionCard
          icon={Bell}
          title="permissions.notifications.title"
          body="permissions.notifications.body"
          access={notifications}
          onAllow={() => askNotifications().then(setNotifications).catch(() => {})}
        />
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <PrimaryButton title={t('common.continue')} onPress={next} />
        {location === 'granted' && notifications === 'granted' ? null : (
          <Pressable onPress={next} hitSlop={8} style={styles.skip}>
            <TextCustom style={styles.skipText}>{t('permissions.skip')}</TextCustom>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.inkMuted,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  cardText: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.inkMuted,
  },
  allow: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.darkBrown,
  },
  allowText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  allowed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.successSoft,
  },
  allowedText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.success,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  skip: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  skipText: {
    color: COLORS.inkMuted,
  },
});
