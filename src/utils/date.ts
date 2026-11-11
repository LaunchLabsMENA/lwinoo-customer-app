import { toWesternDigits } from './validation';

const MIN_AGE = 13;
const MAX_AGE = 120;

export const formatDobInput = (raw: string): string => {
  const digits = toWesternDigits(raw).replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join(' / ');
};

export type DobResult = { valid: true; iso: string | null } | { valid: false };

export const parseDob = (text: string, now: Date = new Date()): DobResult => {
  const digits = toWesternDigits(text).replace(/\D/g, '');
  if (!digits) return { valid: true, iso: null };
  if (digits.length !== 8) return { valid: false };
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return { valid: false };
  }
  if (date.getTime() > now.getTime()) return { valid: false };
  const age = now.getUTCFullYear() - year;
  if (age < MIN_AGE || age > MAX_AGE) return { valid: false };
  const pad = (value: number) => String(value).padStart(2, '0');
  return { valid: true, iso: `${year}-${pad(month)}-${pad(day)}` };
};

export const isoToDob = (iso: string | null | undefined): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  return match ? `${match[3]} / ${match[2]} / ${match[1]}` : '';
};
