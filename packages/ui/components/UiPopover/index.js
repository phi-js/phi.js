// export { default as UiPopover } from './UiPopover.vue'
import { defineAsyncComponent } from 'vue'
export const UiPopover = defineAsyncComponent(() => import('./UiPopover.vue'))