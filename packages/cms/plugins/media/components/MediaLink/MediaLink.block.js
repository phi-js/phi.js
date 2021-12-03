import MediaLink from './MediaLink.vue'
import MediaLinkEditor from './MediaLinkEditor.vue'

export default {
  name: 'MediaLink',
  title: 'Link',
  icon: 'mdi:open-in-new',
  description: 'Vínculo a página externa',

  block: {
    component: MediaLink,
    props: {
      href: '',
      text: '',
      secondary: '',
    },
  },

  editor: {
    face: {
      'component': MediaLinkEditor,
      'v-model': 'block.props',
    },
  },
}