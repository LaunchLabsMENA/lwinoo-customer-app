import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDays, House, LucideIcon, ShoppingBag, SquarePlay, User } from 'lucide-react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';
import { useI18n, type TranslationKey } from '../../i18n';
import { useAuthGate, type AuthGateAction } from '../auth-gate';

// Tabs that hold personal data; guests get the sign-in prompt instead (Profile shows its own guest view).
const GATED: Record<string, AuthGateAction> = {
  Booking: 'bookings',
};

const ICONS: Record<string, LucideIcon> = {
  Home: House,
  Booking: CalendarDays,
  Fashion: ShoppingBag,
  Reels: SquarePlay,
  Profile: User,
};

// Floating pill tab bar.
export const BottomTabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const { requireAuth } = useAuthGate();

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, { flexDirection: row }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const Icon = ICONS[route.name] ?? House;
          const label = t(`tabs.${route.name}` as TranslationKey);
          const onPress = () => {
            const gate = GATED[route.name];
            if (gate && !requireAuth(gate)) return;
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.item}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
            >
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Icon size={20} color={focused ? COLORS.white : COLORS.ink} strokeWidth={1.75} />
              </View>
              <TextCustom style={[styles.label, focused && styles.labelActive]}>{label}</TextCustom>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  bar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.darkBrown,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: COLORS.brand,
  },
  label: {
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  labelActive: {
    fontFamily: FONTS.semiBold,
    color: COLORS.brandDeep,
  },
});
