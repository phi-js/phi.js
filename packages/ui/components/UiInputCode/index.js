// export { default as UiInputCode } from './UiInputCode.vue'
import { defineAsyncComponent } from 'vue'
export const UiInputCode = defineAsyncComponent(() => import('./UiInputCode.vue'))