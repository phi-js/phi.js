// export { default as UiIconPicker } from './UiIconPicker.vue'
import { defineAsyncComponent } from 'vue'
export const UiIconPicker = defineAsyncComponent(() => import('./UiIconPicker.vue'))