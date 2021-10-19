import { provide, inject, reactive, useAttrs } from 'vue'
import { toDate } from '/packages/ui/helpers'

export function provideI18n(options) {
  const provided = reactive(options)
  provide('$_phi_i18n', provided)
  return provided
}

export function useI18n(dictionary = null) {
  const injected = inject('$_phi_i18n') || {}
  const attrs = useAttrs()
  const messages = deepMerge(injected?.messages, dictionary)

  return {
    get locale() {
      return injected.locale
    },

    set locale(newValue) {
      injected.locale = newValue
    },

    // Translate a word
    t(word) {
      const targetLocale = attrs?.['i18n-language'] || injected.locale
      const baseLocale = targetLocale.substr(0, 2)
      return (
        messages?.[targetLocale]?.[word] ||
        messages?.[baseLocale]?.[word] ||
        messages?.[injected.fallbackLocale]?.[word] ||
        word + '(?)'
      )
    },

    // Format date
    d(date, options = undefined) {
      const targetLocale = attrs?.['i18n-language'] || injected.locale
      let objDate = toDate(date)
      if (!objDate) {
        return date + '(?)'
      }
      return objDate.toLocaleDateString(targetLocale, options)
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
