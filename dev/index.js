import { createApp } from 'vue'

import { provideClient } from '../packages/api'
provideClient('phi', { baseURL: 'http://phi.local/' })

import App from './App.vue'
createApp(App).mount('#app')
