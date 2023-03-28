import LayoutGroup from './LayoutGroup.vue'
import LayoutGroupEditor from './LayoutGroupEditor.vue'
import LayoutGroupSettings from './LayoutGroupSettings.vue'

export default {
  name: 'LayoutGroup',
  title: 'Group',
  icon: 'mdi:group',

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
    face: { component: LayoutGroupEditor },
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