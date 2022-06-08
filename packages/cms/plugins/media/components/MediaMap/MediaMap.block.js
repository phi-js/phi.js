import { defineAsyncComponent } from 'vue'
const UiMap = defineAsyncComponent(() => import('../../../../../ui/components/UiMap').then((mod) => mod.UiMap))

export default {
  tags: ['embed'],
  name: 'MediaMap',
  title: 'Mapa',
  icon: 'mdi:map',

  block: { component: UiMap },
}