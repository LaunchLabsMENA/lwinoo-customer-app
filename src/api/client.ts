import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config';
import { useSession } from '../store/session';
import { toApiError } from './errors';
import type { Tokens } from './types';

export const http = axios.create({ baseURL: API_BASE_URL, timeout: REQUEST_TIMEOUT_MS });

type Retriable = InternalAxiosRequestConfig & { _retried?: boolean };

let inflight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const current = useSession.getState().tokens;
  if (!current) throw new Error('No session');
  const response = await axios.post<Tokens & { expiresIn: number }>(
    '/api/auth/refresh',
    { refreshToken: current.refreshToken },
    { baseURL: API_BASE_URL, timeout: REQUEST_TIMEOUT_MS },
  );
  useSession.getState().setTokens({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  });
  return response.data.accessToken;
}

// A 401 from sign-in, refresh or logout must not trigger a refresh; /api/auth/me is a normal protected call.
const skipsRefresh = (url?: string) => !!url && url.includes('/api/auth/') && !url.endsWith('/api/auth/me');

const DEAD_SESSION_CODES = new Set([
  'INVALID_REFRESH_TOKEN',
  'EXPIRED_REFRESH_TOKEN',
  'REVOKED_REFRESH_TOKEN',
  'SESSION_REVOKED',
  'ACCOUNT_DEACTIVATED',
]);

const isEnvelope = (body: unknown): body is { success: true; data: unknown } =>
  typeof body === 'object' && body !== null && (body as { success?: unknown }).success === true && 'data' in body;

http.interceptors.request.use(config => {
  const token = useSession.getState().tokens?.accessToken;
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  response => {
    if (isEnvelope(response.data)) response.data = response.data.data;
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as Retriable | undefined;
    const hasSession = !!useSession.getState().tokens;
    if (hasSession && toApiError(error).code === 'ACCOUNT_DEACTIVATED') useSession.getState().clear();
    if (error.response?.status !== 401 || !original || original._retried || skipsRefresh(original.url) || !useSession.getState().tokens) {
      throw error;
    }
    original._retried = true;
    try {
      inflight ??= refreshAccessToken().finally(() => {
        inflight = null;
      });
      const token = await inflight;
      original.headers.Authorization = `Bearer ${token}`;
      return await http(original);
    } catch (refreshError) {
      if (axios.isAxiosError(refreshError) && (refreshError.response?.status === 401 || DEAD_SESSION_CODES.has(toApiError(refreshError).code))) {
        useSession.getState().clear();
      }
      throw refreshError === error ? error : refreshError;
    }
  },
);
