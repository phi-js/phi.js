import { provide, inject, reactive } from 'vue'

export function provideI18n(options) {
  provide('$_phidias_i18n', options)
  return options
}

export function useI18n(dictionary = null) {
  const injected = inject('$_phidias_i18n') || {}

  const i18n = {
    ...injected,
    messages: deepMerge(injected?.messages, dictionary)
  }

  const base = reactive({
    ...i18n,

    t(word) {
      return i18n?.messages?.[base.locale]?.[word] || word + '(?)'
    },

    d(date, options = null) {
      console.log('i18n.d', date, options)
    }
  })

  return base
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
