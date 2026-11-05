import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATALOGUES, RTL_LOCALES, en } from './translations';
import type { Locale, TranslationKey } from './translations';

export type { Locale, TranslationKey } from './translations';

const STORAGE_KEY = '@lwinoo/locale';

export interface I18nValue {
  locale: Locale;
  isRTL: boolean;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
  // Use for flexDirection on rows whose order should mirror in Arabic.
  row: 'row' | 'row-reverse';
  align: 'left' | 'right';
}

const I18nContext = createContext<I18nValue | null>(null);

// Wrap values that must stay left-to-right inside Arabic text (phone numbers, codes).
export function ltr(value: string): string {
  const LRM = '‎';
  return `${LRM}${value}${LRM}`;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

function detectLocale(): Locale {
  try {
    const tag = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    return tag.toLowerCase().startsWith('ar') ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

export const I18nProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (!cancelled && stored && stored in CATALOGUES) setLocaleState(stored as Locale);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo<I18nValue>(() => {
    const isRTL = RTL_LOCALES.includes(locale);
    const catalogue = CATALOGUES[locale];
    return {
      locale,
      isRTL,
      setLocale,
      row: isRTL ? 'row-reverse' : 'row',
      align: isRTL ? 'right' : 'left',
      t: (key, vars) => interpolate(catalogue[key] ?? en[key] ?? key, vars),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
