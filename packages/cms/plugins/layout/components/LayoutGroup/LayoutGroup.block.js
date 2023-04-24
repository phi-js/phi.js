import LayoutGroup from './LayoutGroup.vue'
// import LayoutGroupEditor from './LayoutGroupEditor.vue'
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
      style: {},
    },
  },

  staging: true,

  editor: {
    // component: LayoutGroupEditor,
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