import { formatDobInput, isoToDob, parseDob } from '../src/utils/date';
import { isValidPhone, toE164 } from '../src/utils/validation';
import { DEFAULT_COUNTRY } from '../src/utils/countries';

describe('date of birth helpers', () => {
  const now = new Date('2026-11-10T00:00:00Z');

  it('formats digits as DD / MM / YYYY', () => {
    expect(formatDobInput('25')).toBe('25');
    expect(formatDobInput('2504')).toBe('25 / 04');
    expect(formatDobInput('25041995')).toBe('25 / 04 / 1995');
    expect(formatDobInput('٢٥٠٤١٩٩٥')).toBe('25 / 04 / 1995');
    expect(formatDobInput('250419951234')).toBe('25 / 04 / 1995');
  });

  it('accepts empty and valid dates', () => {
    expect(parseDob('', now)).toEqual({ valid: true, iso: null });
    expect(parseDob('25 / 04 / 1995', now)).toEqual({ valid: true, iso: '1995-04-25' });
  });

  it('rejects impossible, future and under-age dates', () => {
    expect(parseDob('31 / 02 / 1995', now).valid).toBe(false);
    expect(parseDob('25 / 04', now).valid).toBe(false);
    expect(parseDob('01 / 01 / 2030', now).valid).toBe(false);
    expect(parseDob('01 / 01 / 2020', now).valid).toBe(false);
    expect(parseDob('01 / 01 / 1890', now).valid).toBe(false);
  });

  it('turns an ISO date back into the input format', () => {
    expect(isoToDob('1995-04-25')).toBe('25 / 04 / 1995');
    expect(isoToDob(null)).toBe('');
  });
});

describe('phone helpers', () => {
  it('builds E.164 for Saudi mobiles and strips the trunk zero', () => {
    expect(DEFAULT_COUNTRY.code).toBe('SA');
    expect(toE164(DEFAULT_COUNTRY, '0512345678')).toBe('+966512345678');
    expect(isValidPhone(DEFAULT_COUNTRY, '512345678')).toBe(true);
    expect(isValidPhone(DEFAULT_COUNTRY, '412345678')).toBe(false);
  });
});
