// import { UiKatex } from '@/packages/ui/components/UiKatex'
import { defineAsyncComponent } from 'vue'
const UiKatex = defineAsyncComponent(() => import('@/packages/ui/components/UiKatex').then((mod) => mod.UiKatex))

export default {
  name: 'MediaMath',
  title: 'Fórmula',
  icon: 'mdi:variable',

  block: { component: UiKatex },
}