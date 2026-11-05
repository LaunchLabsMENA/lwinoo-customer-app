export interface Country {
  code: string; // ISO 3166-1 alpha-2
  dial: string; // without "+"
  flag: string;
  name: string;
  nameAr: string;
  // National number length range (digits after the dial code, no trunk 0).
  minLength: number;
  maxLength: number;
}

// Same list and order as the Ora apps (GCC first), with Arabic names added.
export const COUNTRIES: Country[] = [
  { code: 'SA', dial: '966', flag: '🇸🇦', name: 'Saudi Arabia', nameAr: 'السعودية', minLength: 9, maxLength: 9 },
  { code: 'AE', dial: '971', flag: '🇦🇪', name: 'United Arab Emirates', nameAr: 'الإمارات', minLength: 9, maxLength: 9 },
  { code: 'KW', dial: '965', flag: '🇰🇼', name: 'Kuwait', nameAr: 'الكويت', minLength: 8, maxLength: 8 },
  { code: 'QA', dial: '974', flag: '🇶🇦', name: 'Qatar', nameAr: 'قطر', minLength: 8, maxLength: 8 },
  { code: 'BH', dial: '973', flag: '🇧🇭', name: 'Bahrain', nameAr: 'البحرين', minLength: 8, maxLength: 8 },
  { code: 'OM', dial: '968', flag: '🇴🇲', name: 'Oman', nameAr: 'عُمان', minLength: 8, maxLength: 8 },
  { code: 'JO', dial: '962', flag: '🇯🇴', name: 'Jordan', nameAr: 'الأردن', minLength: 9, maxLength: 9 },
  { code: 'LB', dial: '961', flag: '🇱🇧', name: 'Lebanon', nameAr: 'لبنان', minLength: 7, maxLength: 8 },
  { code: 'EG', dial: '20', flag: '🇪🇬', name: 'Egypt', nameAr: 'مصر', minLength: 10, maxLength: 10 },
  { code: 'IQ', dial: '964', flag: '🇮🇶', name: 'Iraq', nameAr: 'العراق', minLength: 10, maxLength: 10 },
  { code: 'PK', dial: '92', flag: '🇵🇰', name: 'Pakistan', nameAr: 'باكستان', minLength: 10, maxLength: 10 },
  { code: 'IN', dial: '91', flag: '🇮🇳', name: 'India', nameAr: 'الهند', minLength: 10, maxLength: 10 },
  { code: 'BD', dial: '880', flag: '🇧🇩', name: 'Bangladesh', nameAr: 'بنغلاديش', minLength: 10, maxLength: 10 },
  { code: 'LK', dial: '94', flag: '🇱🇰', name: 'Sri Lanka', nameAr: 'سريلانكا', minLength: 9, maxLength: 9 },
  { code: 'NP', dial: '977', flag: '🇳🇵', name: 'Nepal', nameAr: 'نيبال', minLength: 10, maxLength: 10 },
  { code: 'PH', dial: '63', flag: '🇵🇭', name: 'Philippines', nameAr: 'الفلبين', minLength: 10, maxLength: 10 },
  { code: 'ID', dial: '62', flag: '🇮🇩', name: 'Indonesia', nameAr: 'إندونيسيا', minLength: 9, maxLength: 12 },
  { code: 'MY', dial: '60', flag: '🇲🇾', name: 'Malaysia', nameAr: 'ماليزيا', minLength: 9, maxLength: 10 },
  { code: 'TR', dial: '90', flag: '🇹🇷', name: 'Turkey', nameAr: 'تركيا', minLength: 10, maxLength: 10 },
  { code: 'US', dial: '1', flag: '🇺🇸', name: 'United States', nameAr: 'الولايات المتحدة', minLength: 10, maxLength: 10 },
  { code: 'CA', dial: '1', flag: '🇨🇦', name: 'Canada', nameAr: 'كندا', minLength: 10, maxLength: 10 },
  { code: 'GB', dial: '44', flag: '🇬🇧', name: 'United Kingdom', nameAr: 'المملكة المتحدة', minLength: 10, maxLength: 10 },
  { code: 'FR', dial: '33', flag: '🇫🇷', name: 'France', nameAr: 'فرنسا', minLength: 9, maxLength: 9 },
  { code: 'DE', dial: '49', flag: '🇩🇪', name: 'Germany', nameAr: 'ألمانيا', minLength: 10, maxLength: 11 },
  { code: 'IT', dial: '39', flag: '🇮🇹', name: 'Italy', nameAr: 'إيطاليا', minLength: 9, maxLength: 10 },
  { code: 'ES', dial: '34', flag: '🇪🇸', name: 'Spain', nameAr: 'إسبانيا', minLength: 9, maxLength: 9 },
  { code: 'NL', dial: '31', flag: '🇳🇱', name: 'Netherlands', nameAr: 'هولندا', minLength: 9, maxLength: 9 },
  { code: 'SE', dial: '46', flag: '🇸🇪', name: 'Sweden', nameAr: 'السويد', minLength: 7, maxLength: 9 },
  { code: 'CH', dial: '41', flag: '🇨🇭', name: 'Switzerland', nameAr: 'سويسرا', minLength: 9, maxLength: 9 },
  { code: 'RU', dial: '7', flag: '🇷🇺', name: 'Russia', nameAr: 'روسيا', minLength: 10, maxLength: 10 },
  { code: 'CN', dial: '86', flag: '🇨🇳', name: 'China', nameAr: 'الصين', minLength: 11, maxLength: 11 },
  { code: 'JP', dial: '81', flag: '🇯🇵', name: 'Japan', nameAr: 'اليابان', minLength: 10, maxLength: 10 },
  { code: 'KR', dial: '82', flag: '🇰🇷', name: 'South Korea', nameAr: 'كوريا الجنوبية', minLength: 9, maxLength: 10 },
  { code: 'AU', dial: '61', flag: '🇦🇺', name: 'Australia', nameAr: 'أستراليا', minLength: 9, maxLength: 9 },
  { code: 'ZA', dial: '27', flag: '🇿🇦', name: 'South Africa', nameAr: 'جنوب أفريقيا', minLength: 9, maxLength: 9 },
  { code: 'NG', dial: '234', flag: '🇳🇬', name: 'Nigeria', nameAr: 'نيجيريا', minLength: 10, maxLength: 10 },
  { code: 'KE', dial: '254', flag: '🇰🇪', name: 'Kenya', nameAr: 'كينيا', minLength: 9, maxLength: 9 },
  { code: 'MA', dial: '212', flag: '🇲🇦', name: 'Morocco', nameAr: 'المغرب', minLength: 9, maxLength: 9 },
  { code: 'BR', dial: '55', flag: '🇧🇷', name: 'Brazil', nameAr: 'البرازيل', minLength: 10, maxLength: 11 },
  { code: 'MX', dial: '52', flag: '🇲🇽', name: 'Mexico', nameAr: 'المكسيك', minLength: 10, maxLength: 10 },
];

export const DEFAULT_COUNTRY: Country = COUNTRIES[0]; // Saudi Arabia

export const countryName = (country: Country, locale: string): string =>
  locale === 'ar' ? country.nameAr : country.name;

// Match on English name, Arabic name, ISO code or dial code ("+966", "966").
export const filterCountries = (list: Country[], query: string): Country[] => {
  const q = query.trim().toLowerCase().replace(/^\+/, '');
  if (!q) return list;
  return list.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.nameAr.includes(q) ||
      c.code.toLowerCase() === q ||
      c.dial.startsWith(q),
  );
};
