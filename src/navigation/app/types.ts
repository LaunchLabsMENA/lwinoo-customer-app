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
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Booking: undefined;
  Reels: undefined;
  Saved: undefined;
  Profile: undefined;
};
