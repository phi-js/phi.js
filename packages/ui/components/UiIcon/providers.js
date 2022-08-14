import { defineAsyncComponent } from 'vue'
// import ProviderMdi from './Provider/Mdi.vue'
const ProviderMdi = defineAsyncComponent(() => import('./Provider/Mdi.vue'))
import ProviderImage from './Provider/Image.vue'
import ProviderText from './Provider/Text.vue'

export default {
  file: ProviderImage,
  http: ProviderImage,
  https: ProviderImage,
  data: ProviderImage,
  mdi: ProviderMdi,
  text: ProviderText,
}
