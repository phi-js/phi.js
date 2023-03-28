import MediaLink from './MediaLink.vue'
import MediaLinkEditor from './MediaLinkEditor.vue'

export default {
  name: 'MediaLink',
  title: 'Link',
  icon: 'mdi:open-in-new',

  block: {
    component: MediaLink,
    props: {
      href: '',
      text: '',
      secondary: '',
    },
  },

  editor: {
    actions: [
      {
        'id': 'MediaLinkEditor',
        'title': 'Settings',
        'component': MediaLinkEditor,
        'v-model': 'block.props',
      },
    ],
  },
}