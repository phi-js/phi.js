import NavigationLink from './NavigationLink.vue'
import NavigationLinkEditor from './NavigationLinkEditor.vue'

export default {
  private: true,

  name: 'NavigationLink',
  title: 'Go to',
  icon: 'mdi:arrow-right-thick',

  block: {
    component: NavigationLink,
    props: {
      pageId: 'next',
      icon: null,
      text: '',
      subtext: '',
    },
  },

  editor: {
    actions: [
      {
        'id': 'NavigationLinkEditor',
        'title': 'Link options',
        'component': NavigationLinkEditor,
        'v-model': 'block',
      },
    ],
  },
}