import { http } from './client';
import { fetchMe, toProfile } from './auth';
import { toApiError } from './errors';
import type { Category, OnboardingStep, ProfileFields, ProfileInput } from './types';
import { useSession } from '../store/session';
import { UPLOAD_BASE_URL } from '../config';

const UPLOAD_TIMEOUT_MS = 60000;

const guard = async <T>(job: Promise<T>): Promise<T> => {
  try {
    return await job;
  } catch (error) {
    throw toApiError(error);
  }
};

type SavedProfile = ProfileFields & { profileCompleted: boolean; onboardingStep: OnboardingStep };

export async function saveProfile(input: ProfileInput): Promise<void> {
  const { data } = await guard(http.put<SavedProfile>('/api/me/profile', input));
  const me = useSession.getState().me;
  if (me) {
    useSession.getState().setMe({
      ...me,
      profileCompleted: data.profileCompleted,
      onboardingStep: data.onboardingStep,
      profile: toProfile(data),
    });
  }
}

export const getCategories = async () => (await guard(http.get<Category[]>('/api/categories'))).data;

export const getSelectedCategories = async () =>
  (await guard(http.get<{ categoryIds: string[] }>('/api/me/preferences'))).data.categoryIds;

export const saveSelectedCategories = async (categoryIds: string[]) => {
  await guard(http.put('/api/me/preferences', { categoryIds }));
};

export async function completeOnboarding(): Promise<void> {
  await guard(http.post('/api/me/onboarding/complete'));
  await fetchMe().catch(() => {});
}

export async function uploadAvatar(uri: string, contentType: string): Promise<string> {
  const form = new FormData();
  form.append('purpose', 'photo');
  form.append('file', { uri, type: contentType, name: contentType === 'image/png' ? 'avatar.png' : 'avatar.jpg' } as unknown as Blob);
  const { data } = await guard(
    http.post<{ fileId: string; url: string }>('/api/files', form, {
      ...(UPLOAD_BASE_URL ? { baseURL: UPLOAD_BASE_URL } : null),
      // ngrok's free tier serves an HTML warning page instead of the API unless this header is present.
      headers: { 'Content-Type': 'multipart/form-data', 'ngrok-skip-browser-warning': 'true' },
      timeout: UPLOAD_TIMEOUT_MS,
    }),
  );
  return data.fileId;
}
