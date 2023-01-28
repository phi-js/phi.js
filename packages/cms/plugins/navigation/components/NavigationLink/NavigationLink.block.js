import NavigationLink from './NavigationLink.vue'
import NavigationLinkEditor from './NavigationLinkEditor.vue'

export default {
  tags: ['navigation'],

  name: 'NavigationLink',
  title: 'Link to page',
  icon: 'mdi:arrow-right-thick',

  block: {
    component: NavigationLink,
    props: {
      pageId: null,
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