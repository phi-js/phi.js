import LayoutGroup from './LayoutGroup.vue'
import LayoutGroupEditor from './LayoutGroupEditor.vue'
import LayoutGroupSettings from './LayoutGroupSettings.vue'

export default {
  name: 'LayoutGroup',
  title: 'Group',
  icon: 'mdi:group',

  block: {
    component: LayoutGroup,
    props: { direction: 'column' },
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