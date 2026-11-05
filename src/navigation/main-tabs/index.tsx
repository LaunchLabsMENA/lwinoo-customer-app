import { StyleSheet } from 'react-native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../app/types';
import { BottomTabBar } from '../../components/bottom-tab-bar';
import { Placeholder } from '../../components/placeholder';
import { HomeScreen } from '../../screens/home/home';
import { LanguageToggle } from '../../components/language-toggle';
import { useI18n } from '../../i18n';

const Tab = createBottomTabNavigator<MainTabParamList>();

const BookingScreen = () => <Placeholder title={useI18n().t('tabs.Booking')} />;
const ReelsScreen = () => <Placeholder title={useI18n().t('tabs.Reels')} />;
const SavedScreen = () => <Placeholder title={useI18n().t('tabs.Saved')} />;
// Language switch lives here until the real Profile screen is built.
const ProfileScreen = () => (
  <Placeholder title={useI18n().t('tabs.Profile')}>
    <LanguageToggle style={styles.toggle} />
  </Placeholder>
);
const renderTabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />;

export const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Booking" component={BookingScreen} />
    <Tab.Screen name="Reels" component={ReelsScreen} />
    <Tab.Screen name="Saved" component={SavedScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  toggle: {
    marginTop: 20,
  },
});
