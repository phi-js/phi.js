import I18n from './I18n'
import languages from './languages/index.js'

const i18n = new I18n()
i18n.patch(languages)

export default i18n