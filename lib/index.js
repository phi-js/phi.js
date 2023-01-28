// export * from '../packages/api'
// export * from '../packages/cms'
// export * from '../packages/i18n'
// export * from '../packages/ui'

import '../packages/ui/themes/base/index.scss'
import '../packages/cms/themes/base/index.scss'

export * as api from '../packages/api'
export * as cms from '../packages/cms'
export * as i18n from '../packages/i18n'
export * from '../packages/ui'

export { createApp as Vue3CreateApp } from 'vue'
