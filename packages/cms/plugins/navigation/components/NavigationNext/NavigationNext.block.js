import NavigationNext from './NavigationNext.vue'
import NavigationLinkEditor from '../NavigationLink/NavigationLinkEditor.vue'

export default {
  tags: ['navigation'],

  name: 'NavigationNext',
  title: 'Link Next',
  icon: 'mdi:arrow-right-thick',

  block: {
    component: NavigationNext,
    props: {
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