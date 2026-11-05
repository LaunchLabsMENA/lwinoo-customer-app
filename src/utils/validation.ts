import type { Country } from './countries';

// Arabic-Indic (٠-٩) and Persian (۰-۹) digits → 0-9, so Arabic keyboards work.
export const toWesternDigits = (input: string): string =>
  input.replace(/[٠-٩۰-۹]/g, ch => {
    const code = ch.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });

export const toPhoneDigits = (raw: string): string => toWesternDigits(raw).replace(/\D/g, '');

// Arabic punctuation that some keyboards insert in emails.
const EMAIL_PUNCT: Record<string, string> = { '٫': '.', '۔': '.', '،': ',', '＠': '@' };

export const normalizeEmail = (raw: string): string =>
  toWesternDigits(raw)
    .replace(/[٫۔،＠]/g, ch => EMAIL_PUNCT[ch] ?? ch)
    .trim()
    .toLowerCase();

export const isValidEmail = (value: string): boolean =>
  value.length <= 254 && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/.test(value);

// National number: digits only, with any trunk "0" or repeated dial code stripped.
export const toNationalNumber = (country: Country, raw: string): string => {
  let digits = toPhoneDigits(raw);
  if (digits.startsWith('00' + country.dial)) digits = digits.slice(2 + country.dial.length);
  else if (digits.startsWith(country.dial) && digits.length > country.maxLength) digits = digits.slice(country.dial.length);
  return digits.replace(/^0+/, '');
};

export const isValidPhone = (country: Country, raw: string): boolean => {
  const national = toNationalNumber(country, raw);
  if (national.length < country.minLength || national.length > country.maxLength) return false;
  // Saudi numbers must be mobiles: 5X XXX XXXX (same rule as the Ora apps).
  if (country.code === 'SA') return /^5\d{8}$/.test(national);
  return true;
};

// E.164, e.g. +966512345678
export const toE164 = (country: Country, raw: string): string => `+${country.dial}${toNationalNumber(country, raw)}`;
