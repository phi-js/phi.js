import LayoutGroup from './LayoutGroup.vue'
import LayoutGroupFace from './LayoutGroupFace.vue'
import LayoutGroupSettings from './LayoutGroupSettings.vue'

export default {
  name: 'LayoutGroup',
  title: 'Group',
  icon: 'mdi:view-agenda',

  block: {
    component: LayoutGroup,
    props: {
      direction: 'column',
      style: {
        'display': 'block',
        'flex-direction': 'row',
        'flex-wrap': 'nowrap',
        'align-items': 'flex-start',
        'justify-content': 'flex-start',
      },
    },
  },

  staging: true,

  editor: {
    face: { component: LayoutGroupFace },
    actions: [
      {
        'id': 'LayoutGroupSettings',
        'title': 'Group options',
        'component': LayoutGroupSettings,
        'v-model': 'block',
      },
    ],
  },
}