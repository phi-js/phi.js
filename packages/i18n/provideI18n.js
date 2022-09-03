import { provide, reactive } from 'vue'
import { locale } from './locale'

export default function provideI18n(options) {
  const provided = reactive(options)
  provide('$_phi_i18n', provided)

  if (options?.locale != locale.value) {
    locale.value = options.locale
  }

  return {
    ...provided,

    get locale() {
      return locale.value
    },
    set locale(newValue) {
      locale.value = newValue
    },
  }
}
