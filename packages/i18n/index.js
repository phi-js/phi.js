import { provide, inject, reactive } from 'vue'
import { toDate } from '/packages/ui/helpers'

export function provideI18n(options) {
  const provided = reactive(options)
  provide('$_phidias_i18n', provided)
  return provided
}

export function useI18n(dictionary = null) {
  const injected = inject('$_phidias_i18n') || {}
  const messages = deepMerge(injected?.messages, dictionary)

  return {
    get locale() {
      return injected.locale
    },

    set locale(newValue) {
      injected.locale = newValue
    },

    t(word) {
      return messages?.[injected.locale]?.[word] || word + '(?)'
    },

    d(date, options = undefined) {
      let objDate = toDate(date)
      if (!objDate) {
        return date + '(?)'
      }

      return objDate.toLocaleDateString(injected.locale, options)
    }
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
