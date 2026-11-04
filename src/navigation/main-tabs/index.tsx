import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../app/types';
import { BottomTabBar } from '../../components/bottom-tab-bar';
import { Placeholder } from '../../components/placeholder';
import { HomeScreen } from '../../screens/home/home';

const Tab = createBottomTabNavigator<MainTabParamList>();

const BookingScreen = () => <Placeholder title="Booking" />;
const ReelsScreen = () => <Placeholder title="Reels" />;
const SavedScreen = () => <Placeholder title="Saved" />;
const ProfileScreen = () => <Placeholder title="Profile" />;
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
