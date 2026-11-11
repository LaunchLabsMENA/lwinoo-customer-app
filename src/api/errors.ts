import axios from 'axios';
import type { TranslationKey } from '../i18n';

export type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
    readonly details: Record<string, unknown> = {},
  ) {
    super(message);
  }

  get isNetwork() {
    return this.status === 0;
  }
}

type ErrorBody = { error?: { code?: string; message?: string; details?: unknown; retryAfter?: number } };

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    if (!error.response) return new ApiError('NETWORK_ERROR', error.message, 0);
    const info = (error.response.data as ErrorBody | undefined)?.error;
    // Validation failures send `details` as a list of field problems.
    const details = info?.details && !Array.isArray(info.details) ? (info.details as Record<string, unknown>) : {};
    return new ApiError(
      info?.code ?? 'UNKNOWN',
      info?.message ?? error.message,
      error.response.status,
      info?.retryAfter === undefined ? details : { ...details, retryAfter: info.retryAfter },
    );
  }
  return new ApiError('UNKNOWN', error instanceof Error ? error.message : 'Unknown error', -1);
}

export function errorMessage(error: unknown, t: Translate): string {
  const e = toApiError(error);
  switch (e.code) {
    case 'NETWORK_ERROR':
      return t('error.network');
    case 'OTP_INVALID': {
      const left = e.details.attemptsLeft;
      return typeof left === 'number' && left > 0 ? t('error.otpInvalidLeft', { count: left }) : t('error.otpInvalid');
    }
    case 'OTP_EXPIRED':
    case 'OTP_NOT_FOUND':
      return t('error.otpInvalid');
    case 'OTP_LOCKED':
    case 'OTP_ATTEMPTS_EXCEEDED':
      return t('error.otpLocked');
    case 'OTP_LIMIT_REACHED':
      return t('error.otpSendLimit');
    case 'OTP_COOLDOWN':
      return t('error.otpCooldown', { seconds: Number(e.details.retryAfter ?? 60) });
    case 'OTP_DELIVERY_FAILED':
    case 'OTP_REQUEST_FAILED':
      return t('error.sendFailed');
    case 'INVALID_IDENTIFIER':
      return t('error.invalidIdentifier');
    case 'ACCOUNT_NOT_FOUND':
      return t('error.accountNotFound');
    case 'ACCOUNT_EXISTS':
      return t('error.accountExists');
    case 'ACCOUNT_TYPE_NOT_ALLOWED':
    case 'ACCOUNT_CONFLICT':
      return t('error.roleMismatch');
    case 'ACCOUNT_DEACTIVATED':
      return t('error.accountBlocked');
    case 'RATE_LIMITED':
    case 'AUTH_THROTTLED':
      return t('error.rateLimited');
    case 'ADDRESS_LIMIT':
      return t('error.addressLimit');
    case 'VALIDATION_ERROR':
      return e.message || t('error.generic');
    default:
      return t('error.generic');
  }
}

export const retryAfterSeconds = (error: unknown): number | undefined => {
  const value = toApiError(error).details.retryAfter;
  return typeof value === 'number' ? value : undefined;
};
