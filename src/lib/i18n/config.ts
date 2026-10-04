export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ar'

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
}

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
}

// Arabic routes mapping
export const routes: Record<Locale, Record<string, string>> = {
  ar: {
    home: '',
    listings: 'عقارات',
    properties: 'عقارات',
    'list-your-property': 'اعرض-عقارك',
    'property-request': 'اطلب-عقار',
    about: 'عن-المكتب',
    contact: 'تواصل',
    neighborhoods: 'احياء',
    privacy: 'سياسة-الخصوصية',
  },
  en: {
    home: '',
    listings: 'properties',
    properties: 'properties',
    'list-your-property': 'list-your-property',
    'property-request': 'property-request',
    about: 'about',
    contact: 'contact',
    neighborhoods: 'neighborhoods',
    privacy: 'privacy',
  },
}
