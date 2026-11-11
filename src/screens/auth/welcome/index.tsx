import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Gift, Sparkle } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { BrandGradient } from '../../../components/brand-gradient';
import { PrimaryButton } from '../../../components/primary-button';
import { useI18n } from '../../../i18n';
import { useSession } from '../../../store/session';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const fullName = useSession(state => state.me?.profile?.displayName ?? '');
  const firstName = fullName.split(' ')[0] ?? '';

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <BrandGradient id="welcomeGradient" colors={['#F1DCDB', '#FAF0EE', '#F4E2E0', '#E9C9C8']} />

      <View style={styles.hero}>
        <Sparkle size={18} color={COLORS.brandDeep} fill={COLORS.brandDeep} style={[styles.sparkle, styles.sparkleLeft]} />
        <Sparkle size={14} color={COLORS.brand} fill={COLORS.brand} style={[styles.sparkle, styles.sparkleRight]} />
        <View style={styles.checkCircle}>
          <Check size={56} color={COLORS.white} strokeWidth={3} />
        </View>
        <HeadingText style={styles.title}>{t('welcome.title', { name: firstName })}</HeadingText>
        <TextCustom style={styles.body}>{t('welcome.body')}</TextCustom>
      </View>

      <View style={styles.card}>
        <View style={[styles.cardHeader, { flexDirection: row }]}>
          <View>
            <TextCustom style={styles.prive}>LWINOO PRIVÉ</TextCustom>
            <HeadingText style={styles.member}>{fullName}</HeadingText>
          </View>
          <View style={styles.tier}>
            <TextCustom style={styles.tierText}>{t('welcome.tier')}</TextCustom>
          </View>
        </View>
        <View style={[styles.credit, { flexDirection: row }]}>
          <Gift size={20} color={COLORS.brandDeep} />
          <View style={styles.creditBody}>
            <TextCustom style={styles.creditTitle}>{t('welcome.credit', { amount: 100 })}</TextCustom>
            <TextCustom style={styles.creditSub}>{t('welcome.creditSub')}</TextCustom>
          </View>
          <View style={styles.active}>
            <TextCustom style={styles.activeText}>{t('welcome.active')}</TextCustom>
          </View>
        </View>
      </View>

      <PrimaryButton
        title={t('welcome.explore')}
        style={styles.button}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleLeft: {
    left: 30,
    top: 50,
  },
  sparkleRight: {
    right: 40,
    top: 40,
  },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.brandDeep,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brandDeep,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  title: {
    marginTop: 28,
    fontSize: 32,
  },
  body: {
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 21,
    color: COLORS.inkMuted,
  },
  card: {
    marginTop: 32,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  prive: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    letterSpacing: 1.2,
    color: COLORS.brandDeep,
  },
  member: {
    marginTop: 4,
    fontFamily: FONTS.headingSemiBold,
    fontSize: 18,
  },
  tier: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.brandSoft,
  },
  tierText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  credit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.white,
  },
  creditBody: {
    flex: 1,
  },
  creditTitle: {
    fontFamily: FONTS.medium,
  },
  creditSub: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  active: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.successSoft,
  },
  activeText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.success,
  },
  button: {
    marginTop: 32,
  },
});
