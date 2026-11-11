import { http } from './client';
import { toApiError } from './errors';
import type { ApiUser, Me, OtpFlow, OtpMethod, OtpSent, Profile, ProfileFields, SessionResponse } from './types';
import { useSession } from '../store/session';

export const toProfile = (fields: ProfileFields): Profile | null =>
  fields.fullName
    ? {
        displayName: fields.fullName,
        title: fields.title ?? null,
        avatarUrl: fields.avatar,
        dateOfBirth: fields.dateOfBirth?.slice(0, 10) ?? null,
      }
    : null;

const toMe = (user: ApiUser): Me => ({
  id: user.id,
  role: user.role,
  phone: user.phone,
  email: user.email,
  phoneVerified: user.phoneVerified,
  emailVerified: user.emailVerified,
  profileCompleted: user.profileCompleted,
  onboardingStep: user.onboardingStep,
  profile: toProfile(user),
});

export async function requestOtp(flow: OtpFlow, channel: OtpMethod, identifier: string): Promise<OtpSent> {
  try {
    const response = await http.post<OtpSent>(`/api/auth/${flow}/request-otp`, { channel, identifier });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function fetchMe(): Promise<Me> {
  try {
    const response = await http.get<{ user: ApiUser }>('/api/auth/me');
    const me = toMe(response.data.user);
    useSession.getState().setMe(me);
    return me;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function verifyOtp(flow: OtpFlow, channel: OtpMethod, identifier: string, code: string): Promise<SessionResponse> {
  try {
    const response = await http.post<SessionResponse>(`/api/auth/${flow}/verify-otp`, { channel, identifier, code });
    useSession.getState().setSession(
      { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken },
      toMe(response.data.user),
    );
    // The sign-in answer omits title and date of birth; the account call has them.
    await fetchMe().catch(() => {});
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function logout(): Promise<void> {
  const tokens = useSession.getState().tokens;
  useSession.getState().clear();
  if (!tokens) return;
  try {
    await http.post(
      '/api/auth/logout',
      { refreshToken: tokens.refreshToken },
      { timeout: 5000, headers: { Authorization: `Bearer ${tokens.accessToken}` } },
    );
  } catch {}
}
