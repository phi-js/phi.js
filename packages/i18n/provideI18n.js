import singleton from './singleton.js'

/*
provideI18n({
  language: 'es',
  fallbackLanguage: 'en',
  currency: 'COP',
  languages: {
    en: 'English',
    es: 'Español'
  }
})
*/
export default function provideI18n(options = null) {

  if (options?.language) {
    singleton.language.value = options.language
  }

  if (options?.fallbackLanguage) {
    singleton.fallbackLanguage = options.fallbackLanguage
  }

  if (options?.currency) {
    singleton.currency = options.currency
  }

  if (options?.languages) {
    for (let languageCode in options.languages) {
      singleton.addLanguage(languageCode, { title: options.languages[languageCode] })
    }
  }

  return singleton
}
