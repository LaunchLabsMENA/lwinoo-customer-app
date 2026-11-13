import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PaymentId } from '../../screens/fashion/data';

export type RootStackParamList = {
  Splash: undefined;
  Login: { mode?: 'login' | 'signup' } | undefined;
  OtpVerification: { flow: 'login' | 'signup'; method: 'phone' | 'email'; target: string };
  ProfileSetup: { mode?: 'edit' } | undefined;
  Permissions: undefined;
  MapPin: { mode?: 'onboarding' | 'add' | 'edit'; addressId?: string } | undefined;
  Preferences: { mode?: 'edit' } | undefined;
  Addresses: undefined;
  Welcome: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  FashionCollection: { collectionId: string };
  FashionAtelier: { atelierId: string };
  FashionProduct: { productId: string };
  FashionCheckout: { productId: string; size: string; toneId?: string };
  FashionOrderConfirmed: {
    productId: string;
    size: string;
    toneId?: string;
    total: number;
    deliveryId: string;
    paymentId: PaymentId;
    orderNo: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Booking: undefined;
  Fashion: undefined;
  Reels: undefined;
  Profile: undefined;
};
