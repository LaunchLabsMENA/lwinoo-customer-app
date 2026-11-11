import { fetchMe } from '../api/auth';
import { toApiError } from '../api/errors';
import type { OnboardingStep } from '../api/types';
import { useSession } from '../store/session';

type ResumeRoute = 'ProfileSetup' | 'Permissions' | 'Preferences' | 'Main';
export type StartRoute = 'Login' | ResumeRoute;

const ROUTE_FOR_STEP: Record<OnboardingStep, ResumeRoute> = {
  PROFILE: 'ProfileSetup',
  LOCATION: 'Permissions',
  PREFERENCES: 'Preferences',
  DONE: 'Main',
};

export const routeForStep = (step: OnboardingStep): ResumeRoute => ROUTE_FOR_STEP[step];

export async function resolveStartRoute(): Promise<StartRoute> {
  await useSession.getState().hydrate();
  const cached = useSession.getState().me;
  if (!useSession.getState().tokens) return useSession.getState().isGuest ? 'Main' : 'Login';
  try {
    const me = await fetchMe();
    return routeForStep(me.onboardingStep);
  } catch (error) {
    const failure = toApiError(error);
    if (failure.status === 401 || failure.status === 403) {
      useSession.getState().clear();
      return 'Login';
    }
    const fallback = useSession.getState().me ?? cached;
    return fallback ? routeForStep(fallback.onboardingStep) : 'Login';
  }
}
