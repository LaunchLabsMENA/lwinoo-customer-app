import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserRound } from 'lucide-react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';
import { PrimaryButton } from '../primary-button';
import { useI18n, type TranslationKey } from '../../i18n';
import { useSession } from '../../store/session';
import { navigationRef } from '../../navigation/services';

// Actions a guest can see but not perform (same set as Ora).
export type AuthGateAction =
  | 'favourite'
  | 'saveReel'
  | 'likeReel'
  | 'commentReel'
  | 'chat'
  | 'review'
  | 'cart'
  | 'book'
  | 'pay'
  | 'order'
  | 'bookings'
  | 'wallet'
  | 'loyalty'
  | 'notifications'
  | 'profile';

type AuthGateValue = {
  isSignedIn: boolean;
  isGuest: boolean;
  // True when the user may go ahead; otherwise opens the sign-in sheet and returns false.
  requireAuth: (action?: AuthGateAction) => boolean;
};

const AuthGateContext = createContext<AuthGateValue | null>(null);

export const AuthGateProvider: FC<PropsWithChildren> = ({ children }) => {
  const isSignedIn = useSession(state => !!state.tokens);
  const isGuest = useSession(state => state.isGuest && !state.tokens);
  const [action, setAction] = useState<AuthGateAction | null>(null);
  const [visible, setVisible] = useState(false);

  const requireAuth = useCallback(
    (next?: AuthGateAction) => {
      if (isSignedIn) return true;
      setAction(next ?? null);
      setVisible(true);
      return false;
    },
    [isSignedIn],
  );

  const value = useMemo(() => ({ isSignedIn, isGuest, requireAuth }), [isSignedIn, isGuest, requireAuth]);

  return (
    <AuthGateContext.Provider value={value}>
      {children}
      <GuestSignInSheet visible={visible} action={action} onClose={() => setVisible(false)} />
    </AuthGateContext.Provider>
  );
};

export const useAuthGate = (): AuthGateValue => {
  const value = useContext(AuthGateContext);
  if (!value) throw new Error('useAuthGate must be used inside <AuthGateProvider>');
  return value;
};

// Opens the Login screen above the guest's current screen, so closing it returns them where they were.
export const openLogin = (mode: 'login' | 'signup' = 'login') => {
  if (navigationRef.isReady()) navigationRef.navigate('Login', { mode });
};

type SheetProps = { visible: boolean; action: AuthGateAction | null; onClose: () => void };

export const GuestSignInSheet: FC<SheetProps> = ({ visible, action, onClose }) => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  const go = (mode: 'login' | 'signup') => {
    onClose();
    openLogin(mode);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('guestSignIn.notNow')}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]} accessibilityViewIsModal>
          <View style={styles.handle} />
          <View style={styles.art}>
            <UserRound size={44} color={COLORS.brandDeep} strokeWidth={1.5} />
          </View>
          <TextCustom style={styles.title} accessibilityRole="header">
            {t(action ? (`guestGate.${action}` as TranslationKey) : 'guestGate.generic')}
          </TextCustom>
          <TextCustom style={styles.hint}>{t('guestSignIn.eitherWay')}</TextCustom>

          <PrimaryButton title={t('guestSignIn.signUp')} onPress={() => go('signup')} style={styles.cta} />
          <Pressable style={styles.secondary} onPress={() => go('login')} accessibilityRole="button">
            <TextCustom style={styles.secondaryText}>{t('guestSignIn.login')}</TextCustom>
          </Pressable>
          <Pressable style={styles.dismiss} onPress={onClose} accessibilityRole="button">
            <TextCustom style={styles.dismissText}>{t('guestSignIn.notNow')}</TextCustom>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.white,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 18,
  },
  art: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandSoft,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  hint: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: COLORS.inkMuted,
  },
  cta: {
    marginTop: 22,
  },
  secondary: {
    height: 54,
    marginTop: 10,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  dismiss: {
    height: 44,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.inkMuted,
  },
});
