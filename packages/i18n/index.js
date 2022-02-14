import { provide, inject, reactive, useAttrs } from 'vue'
import { toDate } from '@/packages/ui/helpers'
import baseDictionary from './languages'

export function provideI18n(options) {
  const provided = reactive(options)
  provide('$_phi_i18n', provided)
  return provided
}

export function useI18n(dictionary = null) {
  const injected = inject('$_phi_i18n') || {}

  let messages = deepMerge(baseDictionary, injected?.messages)
  messages = deepMerge(messages, dictionary)

  const attrs = useAttrs()

  /*
  Translate a string

  Using params:
  t('There are %number% people', { number: 4 })
  */
  function t(word, params = null) {
    const targetLocale = attrs?.['i18n-language'] || injected.locale
    const baseLocale = targetLocale.substr(0, 2)

    let translated = (
      messages?.[targetLocale]?.[word] ||
        messages?.[baseLocale]?.[word] ||
        messages?.[injected.fallbackLocale]?.[word] ||
        word + '(?)'
    )

    if (params && typeof params === 'object') {
      for (let name in params) {
        console.log('name', name, params[name])
        translated = translated.replaceAll(`%${name}%`, params[name])
      }
    }

    return translated
  }

  return {
    get locale() {
      return injected.locale
    },

    set locale(newValue) {
      injected.locale = newValue
    },

    t,

    // Format date
    d(date, options = undefined) {
      const targetLocale = attrs?.['i18n-language'] || injected.locale
      let objDate = toDate(date)
      if (!objDate) {
        return date + '(?)'
      }
      return objDate.toLocaleString(targetLocale, options)
    },

    // "Pretty date" for past dates (1 minute ago, yesterday, etc)
    // https://stackoverflow.com/questions/7641791/javascript-library-for-human-friendly-relative-date-formatting
    ago(time) {
      const date = toDate(time),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400)

      if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return

      return day_diff == 0 && (
        diff < 60 && t('i18n.justNow')
        || diff < 120 && t('i18n.oneMinuteAgo')
        || diff < 3600 && t('i18n.nMinutesAgo', { n: Math.floor(diff / 60) })
        || diff < 7200 && t('i18n.oneHourAgo')
        || diff < 86400 && t('i18n.nHoursAgo', { n: Math.floor(diff / 3600) })
      )
      || day_diff == 1 && t('i18n.yesterday')
      || day_diff < 7 && t('i18n.nDaysAgo', { n: day_diff })
      || day_diff < 31 && t('i18n.nWeeksAgo', { n: Math.ceil(day_diff / 7) })
    },

    // Format currency
    $(value, currency = null) {
      const targetLocale = attrs?.['i18n-language'] || injected.locale
      return Number(value).toLocaleString(targetLocale, {
        style: 'currency',
        currency: currency || injected.defaultCurrency,
      })
    },
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
