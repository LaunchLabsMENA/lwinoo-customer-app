import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { SplashScreen } from '../../screens/auth/splash';
import { LoginScreen } from '../../screens/auth/login';
import { OtpVerificationScreen } from '../../screens/auth/otp-verification';
import { ProfileSetupScreen } from '../../screens/auth/profile-setup';
import { MapPinScreen } from '../../screens/auth/map-pin';
import { PreferencesScreen } from '../../screens/auth/preferences';
import { WelcomeScreen } from '../../screens/auth/welcome';
import { MainTabs } from '../main-tabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'none' }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen name="MapPin" component={MapPinScreen} />
    <Stack.Screen name="Preferences" component={PreferencesScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: 'fade', gestureEnabled: false }} />
    <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
  </Stack.Navigator>
);
