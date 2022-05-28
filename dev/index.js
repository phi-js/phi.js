import { createApp } from 'vue'
import App from './App.vue'

// Import package themes
import '../packages/ui/themes/base/index.scss'
import '../packages/cms/themes/base/index.scss'
// Classes ui-theme-base, cms-theme-base MUST are added in <body> in index.htm (!)

// import { setTheme } from './theme-utils.js'
// setTheme('ui-theme-base')


createApp(App).mount('#app')
