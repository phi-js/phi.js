import { provide, reactive } from 'vue'

export default function provideI18n(options) {
  const provided = reactive(options)
  provide('$_phi_i18n', provided)

  return provided
}
