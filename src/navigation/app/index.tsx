import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { SplashScreen } from '../../screens/auth/splash';
import { LoginScreen } from '../../screens/auth/login';
import { OtpVerificationScreen } from '../../screens/auth/otp-verification';
import { ProfileSetupScreen } from '../../screens/auth/profile-setup';
import { MapPinScreen } from '../../screens/auth/map-pin';
import { PreferencesScreen } from '../../screens/auth/preferences';
import { WelcomeScreen } from '../../screens/auth/welcome';
import { PermissionsScreen } from '../../screens/auth/permissions';
import { AddressesScreen } from '../../screens/account/addresses';
import { MainTabs } from '../main-tabs';
import { FashionCollectionScreen } from '../../screens/fashion/collection';
import { FashionAtelierScreen } from '../../screens/fashion/atelier';
import { FashionProductScreen } from '../../screens/fashion/product';
import { FashionCheckoutScreen } from '../../screens/fashion/checkout';
import { FashionOrderConfirmedScreen } from '../../screens/fashion/order-confirmed';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'none' }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen name="Permissions" component={PermissionsScreen} />
    <Stack.Screen name="MapPin" component={MapPinScreen} />
    <Stack.Screen name="Preferences" component={PreferencesScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: 'fade', gestureEnabled: false }} />
    <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
    <Stack.Screen name="Addresses" component={AddressesScreen} />
    <Stack.Screen name="FashionCollection" component={FashionCollectionScreen} />
    <Stack.Screen name="FashionAtelier" component={FashionAtelierScreen} />
    <Stack.Screen name="FashionProduct" component={FashionProductScreen} />
    <Stack.Screen name="FashionCheckout" component={FashionCheckoutScreen} />
    <Stack.Screen
      name="FashionOrderConfirmed"
      component={FashionOrderConfirmedScreen}
      options={{ animation: 'fade', gestureEnabled: false }}
    />
  </Stack.Navigator>
);
