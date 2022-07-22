import { h } from 'vue'
import { UiItem } from '@/packages/ui/components'
import MediaItemSettings from './MediaItemSettings.vue'

export default {
  name: 'MediaItem',
  title: 'Item',
  icon: 'mdi:card-account-details',

  block: { component: UiItem },

  editor: {
    face: {
      component: {
        props: {
          modelValue: {
            type: Object,
            required: false,
            default: () => ({}),
          },
        },

        render() {
          return h(UiItem, {
            ...this.modelValue.props,
            text: this.modelValue.props?.text || 'Empty item',
            icon: this.modelValue.props?.icon || 'mdi:help-rhombus',
          })
        },
      },
    },

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