import { UiItem } from '@/packages/ui/components'
import MediaItemSettings from './MediaItemSettings.vue'

export default {
  name: 'MediaItem',
  title: 'Item',
  icon: 'mdi:card-account-details',

  block: {
    component: UiItem,
    props: { bem: 'MediaItem' },
  },

  editor: {
    actions: [
      {
        id: 'MediaItem',
        title: 'Item',
        icon: 'mdi:card-account-details',
        component: MediaItemSettings,
      },
    ],
  },
}