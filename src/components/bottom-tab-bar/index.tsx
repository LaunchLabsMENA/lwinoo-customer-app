import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDays, Heart, House, LucideIcon, SquarePlay, User } from 'lucide-react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';

const ICONS: Record<string, LucideIcon> = {
  Home: House,
  Booking: CalendarDays,
  Reels: SquarePlay,
  Saved: Heart,
  Profile: User,
};

// Floating pill tab bar.
export const BottomTabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const Icon = ICONS[route.name] ?? House;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.item}>
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Icon size={20} color={focused ? COLORS.white : COLORS.ink} strokeWidth={1.75} />
              </View>
              <TextCustom style={[styles.label, focused && styles.labelActive]}>{route.name}</TextCustom>
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
