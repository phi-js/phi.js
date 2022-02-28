import { createApp } from 'vue'
import App from './App.vue'

// set initial theme
import { setTheme } from './theme-utils.js'
setTheme('ui-theme-base')

createApp(App).mount('#app')
