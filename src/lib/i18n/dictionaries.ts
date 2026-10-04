import 'server-only'

export type Locale = 'ar' | 'en'

const dictionaries = {
  ar: () => import('./ar.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
