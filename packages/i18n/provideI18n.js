import singleton from './singleton.js'

/*
provideI18n({
  languages: {
    en: 'English',
    es: 'Español'
  }
})

*/
export default function provideI18n(options = null) {

  if (options?.languages) {
    for (let languageCode in options.languages) {
      singleton.addLanguage(languageCode, { title: options.languages[languageCode] })
    }
  }


  return singleton

  // const provided = reactive(options)
  // provide('$_phi_i18n', provided)

  // if (options?.locale != locale.value) {
  //   locale.value = options.locale
  // }

  // return {
  //   ...provided,

  //   get locale() {
  //     return locale.value
  //   },
  //   set locale(newValue) {
  //     locale.value = newValue
  //   },
  // }
}
