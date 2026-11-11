export type Title = 'MISS' | 'MRS' | 'DR';
export type AddressLabel = 'HOME' | 'WORK' | 'OTHER';
export type OtpMethod = 'phone' | 'email';
export type OtpFlow = 'login' | 'signup';
export type OnboardingStep = 'PROFILE' | 'LOCATION' | 'PREFERENCES' | 'DONE';

export interface Profile {
  displayName: string;
  title: Title | null;
  avatarUrl: string | null;
  dateOfBirth: string | null;
}

export interface Me {
  id: string;
  role: string;
  phone: string | null;
  email: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;
  onboardingStep: OnboardingStep;
  profile: Profile | null;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileFields {
  fullName: string | null;
  title?: Title | null;
  avatar: string | null;
  dateOfBirth?: string | null;
}

export interface ApiUser extends ProfileFields {
  id: string;
  role: string;
  phone: string | null;
  email: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;
  onboardingStep: OnboardingStep;
}

export interface SessionResponse extends Tokens {
  expiresIn: number | string;
  isNewUser: boolean;
  user: ApiUser;
}

export interface OtpSent {
  channel: OtpMethod;
  identifier: string;
  expiresIn: number;
  resendAfter: number;
}

export interface Address {
  id: string;
  label: AddressLabel;
  formattedAddress: string;
  city: string | null;
  district: string | null;
  country: string;
  latitude: number;
  longitude: number;
  placeId: string | null;
  isDefault: boolean;
}

export interface AddressInput {
  label?: AddressLabel;
  formattedAddress: string;
  city?: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  isDefault?: boolean;
}

export interface ProfileInput {
  fullName: string;
  title?: Title | null;
  dateOfBirth?: string | null;
  avatarFileId?: string | null;
}

export interface GeoPlace {
  placeId: string;
  formattedAddress: string;
  city: string | null;
  district: string | null;
  latitude: number;
  longitude: number;
}

export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
  isTopPick: boolean;
  subcategories: { id: string; slug: string; nameEn: string; nameAr: string | null }[];
}
