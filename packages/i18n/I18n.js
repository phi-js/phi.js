import { ref, computed } from 'vue'
import { toDate } from '@/packages/ui/helpers'

export default class I18n {
  /*
  const lang = new I18n({
    language: 'es_CO', // default/current language
    fallbackLanguage: 'es',
    currency: 'cop', // default currency

    languages: {
      es: {
        ... maybe but metadata about the language here? or custom options? (like currency per language?)
        title: 'Español',

        dictionary: {
          'hello': 'hola',
          'world': 'mundo',
          'Hello': 'Hola',
          'World': 'Mundo',
          'SomeComponent.some.tring': 'Cual es tu nombre?',
          'there are {{n}} people': '{{n}} personas presentes',
        }
      },
      fr: {
        title: 'Français',
        dictionary: {
          'hello': 'bonjour',
        }
      }
      ....
    }
  })



  lang.addLanguage('tk_FOO', {
    title: 'Turkiyez',
    dictionary: {
      'hello': 'merhaba'
    }
  })

  lang.updateDictionary('tk_FOO', {
    'hello': 'Ovewritten!'
  })

  lang.patchDictionary('tk_FOO', {
    'hello': 'Si ya existe la deja quieta. asi que esta cadena se ignora'
  })

  lang.patch({
    en: {'some.word': 'New value, if needed'},
    es: {'some.word': 'Valor nuevo'},
    fr: {'some.word': 'Neuf valeur idk'},
  })

  alert( lang.t('hello') )
  */
  constructor(options) {
    let defaultOptions = {
      language: 'es',
      fallbackLanguage: 'en',
      currency: 'cop',

      languages: {},
    }

    let sanitizedOptions = { ...defaultOptions, ...options }

    this.language = ref(sanitizedOptions.language)
    this.fallbackLanguage = sanitizedOptions.fallbackLanguage
    this.currency = sanitizedOptions.currency
    this.languages = sanitizedOptions.languages

    // BASE language.  i.e. "es_CO" => "es"
    this.baseLanguage = computed(() => {
      const match = /^([a-zA-Z]+)[_-]?.*/.exec(this.language.value)
      return match?.[1]
    })
  }


  t(word, params = null, defaultValue = null) {
    let translated = this.languages[this.language.value]?.dictionary?.[word]

    // Not found. Look in base language
    if (!translated) {
      translated = this.languages[this.baseLanguage.value]?.dictionary?.[word]
    }

    // Look in fallback language
    if (!translated) {
      translated = this.languages[this.fallbackLanguage]?.dictionary?.[word]
    }

    if (!translated) {
      return defaultValue === null
        ? word + '(?)'
        : defaultValue
    }

    if (params && typeof params === 'object') {
      for (let paramName in params) {
        translated = translated.replaceAll(`{{${paramName}}}`, params[paramName])
      }
    }

    return translated
  }


  /* Utility functions: format dates, currency, etc */

  // Format date
  date(date, options = undefined) {
    if (Array.isArray(date)) {
      return this.formatRange(date[0], date[1], options)
    }

    const objDate = toDate(date)
    if (!objDate) {
      return date + '(?)'
    }
    return objDate.toLocaleString(this.baseLanguage.value, options || {})
  }

  formatRange(startDate, endDate, options = null) {
    const fmt = new Intl.DateTimeFormat(this.baseLanguage.value, options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const date1 = toDate(startDate)
    const date2 = toDate(endDate)

    return fmt.formatRange(date1, date2)
  }

  // backwards compat.  deprecate
  d(date, options = undefined) {
    return this.date(date, options)
  }

  time(date, options = undefined) {
    const objDate = toDate(date)
    if (!objDate) {
      return date + '(?)'
    }
    return objDate.toLocaleTimeString(this.baseLanguage.value, options)
  }

  datetime(date, options = undefined) {
    const objDate = toDate(date)
    if (!objDate) {
      return date + '(?)'
    }
    return objDate.toLocaleString(this.baseLanguage.value, options)
  }

  // "Pretty date" for past dates (1 minute ago, yesterday, etc)
  // https://stackoverflow.com/questions/7641791/javascript-library-for-human-friendly-relative-date-formatting
  ago(time) {
    const date = toDate(time),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400)

    if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) {
      return this.d(time)
    }

    return day_diff == 0 && (
      diff < 60 && this.t('i18n.justNow')
        || diff < 120 && this.t('i18n.oneMinuteAgo')
        || diff < 3600 && this.t('i18n.nMinutesAgo', { n: Math.floor(diff / 60) })
        || diff < 7200 && this.t('i18n.oneHourAgo')
        || diff < 86400 && this.t('i18n.nHoursAgo', { n: Math.floor(diff / 3600) })
    )
        || day_diff == 1 && this.t('i18n.yesterday')
        || day_diff < 7 && this.t('i18n.nDaysAgo', { n: day_diff })
        || day_diff < 31 && this.t('i18n.nWeeksAgo', { n: Math.ceil(day_diff / 7) })
  }

  // Weekday (ISO-8601: mon=1 sun=7) to locale name (Monday - Sunday)
  weekday(nDay) {
    var baseDate = new Date(Date.UTC(2017, 0, 1)) // just a Sunday
    baseDate.setDate(baseDate.getDate() + parseInt(nDay))
    return baseDate.toLocaleDateString(this.baseLanguage.value, { weekday: 'long' })
  }

  // Format currency
  $(value, currency = null) {
    return Number(value).toLocaleString(this.baseLanguage.value, {
      style: 'currency',
      currency: currency || this.currency || 'USD',
    })
  }

  obj(objValue) {
    return parseTranslationObject(objValue, this.language.value, this.baseLanguage.value)
  }

  /* /utility functions */


  addLanguage(languageCode, languageObject) {
    if (this.languages[languageCode]) {
      this.languages[languageCode] = {
        ...this.languages[languageCode],
        ...languageObject,
      }
      return
    }
    this.languages[languageCode] = languageObject
  }

  updateDictionary(languageCode, newDictionary) {
    if (!this.languages[languageCode]?.dictionary) {
      return
    }

    this.languages[languageCode].dictionary = deepMerge(
      this.languages[languageCode].dictionary,
      newDictionary,
    )
  }

  // fill missing gaps, without ovewriting current dictionary elements
  patchDictionary(languageCode, newDictionary) {
    if (!this.languages[languageCode]) {
      this.languages[languageCode] = { dictionary: newDictionary }
      return
    }

    this.languages[languageCode].dictionary = deepMerge(
      newDictionary,
      this.languages[languageCode].dictionary,
    )
  }

  patch(languageDictionaries) {
    for (let languageCode in languageDictionaries) {
      this.patchDictionary(languageCode, languageDictionaries[languageCode])
    }
  }


  get availableLanguages() {
    const retval = []
    for (let languageCode in this.languages) {
      retval.push({
        value: languageCode,
        text: this.languages[languageCode].title || languageCode,
      })
    }
    return retval
  }
}


function deepMerge(obj1, obj2) {
  if (obj1 === null || typeof obj1 != 'object') {
    return obj2 || obj1
  }

  let retval = { ...obj2 }
  for (let prop in obj1) {
    retval[prop] = deepMerge(obj1[prop], obj2?.[prop])
  }
  return retval
}


/*
const myThing = {
  "title": "OY",
  "description": {
    "$i18n": {
      "en": "A description in english",
      "fr": "Une description en français",
      "es": "Una descripción en español",
    }
  }
}
*/

function parseTranslationObject(obj, language, baseLanguage) {
  if (Array.isArray(obj)) {
    return obj.map((i) => parseTranslationObject(i, language, baseLanguage))
  }

  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (typeof obj['$i18n'] === 'object') {
    return obj['$i18n']?.[language]
      || obj['$i18n']?.[baseLanguage]
      || obj['$i18n']?.[Object.keys(obj['$i18n'])[0]]
  }

  const retval = {}
  for (let [property, value] of Object.entries(obj)) {
    retval[property] = parseTranslationObject(value, language, baseLanguage)
  }
  return retval
}