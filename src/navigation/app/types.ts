export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OtpVerification: { method: 'phone' | 'email'; target: string };
  ProfileSetup: undefined;
  MapPin: undefined;
  Preferences: undefined;
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
