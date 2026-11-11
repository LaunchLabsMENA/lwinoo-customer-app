import type { InternalAxiosRequestConfig } from 'axios';

const mockMemory = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key: string) => Promise.resolve(mockMemory.get(key) ?? null)),
    setItem: jest.fn((key: string, value: string) => {
      mockMemory.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      mockMemory.delete(key);
      return Promise.resolve();
    }),
  },
}));

import { http } from '../src/api/client';
import { logout, verifyOtp } from '../src/api/auth';
import { ApiError, errorMessage, retryAfterSeconds, toApiError } from '../src/api/errors';
import { useSession } from '../src/store/session';
import type { Me } from '../src/api/types';

const me = (profileCompleted = true): Me => ({
  id: 'u1',
  role: 'CUSTOMER',
  phone: '+966512345678',
  email: null,
  phoneVerified: true,
  emailVerified: false,
  profileCompleted,
  onboardingStep: profileCompleted ? 'DONE' : 'PROFILE',
  profile: null,
});

const apiUser = {
  id: 'u1',
  role: 'CUSTOMER',
  phone: '+966512345678',
  email: null,
  phoneVerified: true,
  emailVerified: false,
  profileCompleted: false,
  onboardingStep: 'PROFILE',
  fullName: null,
  avatar: null,
};

type Handler = (config: InternalAxiosRequestConfig) => { status: number; data?: unknown };

const respond = (handler: Handler) => {
  http.defaults.adapter = async config => {
    const result = handler(config as InternalAxiosRequestConfig);
    const response = { data: result.data ?? {}, status: result.status, statusText: '', headers: {}, config };
    if (result.status >= 400) {
      const error = new Error(`status ${result.status}`) as Error & { isAxiosError: boolean; response: typeof response; config: typeof config };
      error.isAxiosError = true;
      error.response = response;
      error.config = config;
      throw error;
    }
    return response;
  };
};

beforeEach(() => {
  mockMemory.clear();
  useSession.setState({ hydrated: false, tokens: null, me: null });
});

describe('session store', () => {
  it('persists and restores the session', async () => {
    useSession.getState().setSession({ accessToken: 'a', refreshToken: 'r' }, me());
    await Promise.resolve();
    useSession.setState({ hydrated: false, tokens: null, me: null });
    await useSession.getState().hydrate();
    expect(useSession.getState().tokens).toEqual({ accessToken: 'a', refreshToken: 'r' });
    expect(useSession.getState().me?.id).toBe('u1');
  });

  it('forgets everything on clear', async () => {
    useSession.getState().setSession({ accessToken: 'a', refreshToken: 'r' }, me());
    useSession.getState().clear();
    await Promise.resolve();
    expect(mockMemory.size).toBe(0);
    expect(useSession.getState().tokens).toBeNull();
  });
});

describe('http client', () => {
  it('attaches the access token', async () => {
    useSession.getState().setSession({ accessToken: 'tok', refreshToken: 'r' }, me());
    let seen = '';
    respond(config => {
      seen = String(config.headers.Authorization);
      return { status: 200 };
    });
    await http.get('/api/auth/me');
    expect(seen).toBe('Bearer tok');
  });

  it('unwraps the success envelope, including a null result', async () => {
    respond(() => ({ status: 200, data: { success: true, data: { value: 1 } } }));
    expect((await http.get('/a')).data).toEqual({ value: 1 });
    respond(() => ({ status: 200, data: { success: true, data: null } }));
    expect((await http.get('/a')).data).toBeNull();
  });

  it('refreshes an expired token on the account call', async () => {
    useSession.getState().setSession({ accessToken: 'old', refreshToken: 'r1' }, me());
    respond(config => (config.headers.Authorization === 'Bearer new' ? { status: 200 } : { status: 401 }));
    const axiosPost = jest.spyOn(require('axios'), 'post').mockResolvedValue({ data: { accessToken: 'new', refreshToken: 'r2' } });
    expect((await http.get('/api/auth/me')).status).toBe(200);
    axiosPost.mockRestore();
  });

  it('does not refresh when sign-in answers 401', async () => {
    useSession.getState().setSession({ accessToken: 'old', refreshToken: 'r1' }, me());
    respond(() => ({ status: 401 }));
    const axiosPost = jest.spyOn(require('axios'), 'post');
    await expect(http.post('/api/auth/login/verify-otp')).rejects.toBeTruthy();
    expect(axiosPost).not.toHaveBeenCalled();
    axiosPost.mockRestore();
  });

  it('ends the session for a deactivated account', async () => {
    useSession.getState().setSession({ accessToken: 'a', refreshToken: 'r' }, me());
    respond(() => ({ status: 403, data: { success: false, error: { code: 'ACCOUNT_DEACTIVATED', message: 'x' } } }));
    await expect(http.get('/a')).rejects.toBeTruthy();
    expect(useSession.getState().tokens).toBeNull();
  });
});

describe('auth calls', () => {
  it('verifies through the chosen flow and stores the session', async () => {
    const calls: { url?: string; data?: string }[] = [];
    respond(config => {
      calls.push({ url: config.url, data: config.data });
      return config.url === '/api/auth/signup/verify-otp'
        ? { status: 200, data: { success: true, data: { user: apiUser, accessToken: 'a', refreshToken: 'r', expiresIn: '15m', isNewUser: true } } }
        : { status: 200, data: { success: true, data: { user: { ...apiUser, fullName: 'Sara Ali', dateOfBirth: '1995-04-20T00:00:00.000Z' } } } };
    });
    const session = await verifyOtp('signup', 'phone', '+966512345678', '1234');
    expect(calls[0]).toEqual({
      url: '/api/auth/signup/verify-otp',
      data: JSON.stringify({ channel: 'phone', identifier: '+966512345678', code: '1234' }),
    });
    expect(calls[1].url).toBe('/api/auth/me');
    expect(session.user.onboardingStep).toBe('PROFILE');
    expect(useSession.getState().tokens).toEqual({ accessToken: 'a', refreshToken: 'r' });
    expect(useSession.getState().me?.profile).toEqual({ displayName: 'Sara Ali', title: null, avatarUrl: null, dateOfBirth: '1995-04-20' });
  });

  it('sends the access token on logout after clearing the session', async () => {
    useSession.getState().setSession({ accessToken: 'tok', refreshToken: 'r' }, me());
    let seen = '';
    respond(config => {
      seen = String(config.headers.Authorization);
      return { status: 200 };
    });
    await logout();
    expect(seen).toBe('Bearer tok');
    expect(useSession.getState().tokens).toBeNull();
  });

  it('refreshes once for several parallel 401s and retries each request', async () => {
    useSession.getState().setSession({ accessToken: 'old', refreshToken: 'r1' }, me());
    let refreshCalls = 0;
    respond(config => {
      return config.headers.Authorization === 'Bearer new' ? { status: 200, data: { ok: true } } : { status: 401 };
    });
    const axiosPost = jest.spyOn(require('axios'), 'post').mockImplementation(async () => {
      refreshCalls += 1;
      return { data: { accessToken: 'new', refreshToken: 'r2', expiresIn: 900 } };
    });
    const results = await Promise.all([http.get('/a'), http.get('/b'), http.get('/c')]);
    expect(results.map(r => r.status)).toEqual([200, 200, 200]);
    expect(refreshCalls).toBe(1);
    expect(useSession.getState().tokens).toEqual({ accessToken: 'new', refreshToken: 'r2' });
    axiosPost.mockRestore();
  });

  it('ends the session only when the refresh token is rejected', async () => {
    useSession.getState().setSession({ accessToken: 'old', refreshToken: 'dead' }, me());
    respond(() => ({ status: 401 }));
    const axiosPost = jest.spyOn(require('axios'), 'post').mockRejectedValue(
      Object.assign(new Error('dead'), { isAxiosError: true, response: { status: 401, data: {} } }),
    );
    await expect(http.get('/a')).rejects.toBeTruthy();
    expect(useSession.getState().tokens).toBeNull();
    axiosPost.mockRestore();
  });

  it('keeps the session when the refresh fails on the network', async () => {
    useSession.getState().setSession({ accessToken: 'old', refreshToken: 'r' }, me());
    respond(() => ({ status: 401 }));
    const axiosPost = jest.spyOn(require('axios'), 'post').mockRejectedValue(Object.assign(new Error('offline'), { isAxiosError: true }));
    await expect(http.get('/a')).rejects.toBeTruthy();
    expect(useSession.getState().tokens).not.toBeNull();
    axiosPost.mockRestore();
  });
});

describe('error mapping', () => {
  const t = (key: string, vars?: Record<string, string | number>) => `${key}${vars ? JSON.stringify(vars) : ''}`;

  it('reads the server error shape', () => {
    const error = toApiError({
      isAxiosError: true,
      message: 'x',
      response: { status: 400, data: { error: { code: 'OTP_INVALID', message: 'bad', details: { attemptsLeft: 3 } } } },
    });
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe('OTP_INVALID');
    expect(errorMessage(error, t as never)).toBe('error.otpInvalidLeft{"count":3}');
  });

  it('flags network failures', () => {
    const error = toApiError({ isAxiosError: true, message: 'Network Error' });
    expect(error.isNetwork).toBe(true);
    expect(errorMessage(error, t as never)).toBe('error.network');
  });

  it('uses the cooldown seconds from the server', () => {
    const error = toApiError({
      isAxiosError: true,
      message: 'x',
      response: { status: 429, data: { success: false, error: { code: 'OTP_COOLDOWN', message: 'wait', retryAfter: 42 } } },
    });
    expect(errorMessage(error, t as never)).toBe('error.otpCooldown{"seconds":42}');
    expect(retryAfterSeconds(error)).toBe(42);
  });

  it('tolerates validation details sent as a list', () => {
    const error = toApiError({
      isAxiosError: true,
      message: 'x',
      response: { status: 400, data: { success: false, error: { code: 'VALIDATION_ERROR', message: 'Not valid', details: [{ keyword: 'required' }] } } },
    });
    expect(error.details).toEqual({});
    expect(errorMessage(error, t as never)).toBe('Not valid');
  });

  it('points login and sign-up to each other', () => {
    expect(errorMessage(new ApiError('ACCOUNT_NOT_FOUND', 'x', 404), t as never)).toBe('error.accountNotFound');
    expect(errorMessage(new ApiError('ACCOUNT_EXISTS', 'x', 409), t as never)).toBe('error.accountExists');
  });
});
