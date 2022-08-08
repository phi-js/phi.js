// export { default as UiUpload } from './UiUpload.vue'
import { defineAsyncComponent } from 'vue'
export const UiUpload = defineAsyncComponent(() => import('./UiUpload.vue'))