// export { default as UiInputJson } from './UiInputJson.vue'
import { defineAsyncComponent } from 'vue'
export const UiInputJson = defineAsyncComponent(() => import('./UiInputJson.vue'))