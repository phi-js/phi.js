import { UiItem, UiItemEditor } from '@/packages/ui/components'

export default {
  name: 'MediaItem',
  title: 'Item',
  icon: 'mdi:card-account-details',

  block: { component: UiItem },

  editor: {
    face: {
      'component': UiItemEditor,
      'v-model': 'block.props',
    },
  },
}