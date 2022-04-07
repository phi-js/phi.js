import NavigationBack from './NavigationBack.vue'
import NavigationLinkEditor from '../NavigationLink/NavigationLinkEditor.vue'

export default {
  tags: ['navigation'],

  name: 'NavigationBack',
  title: 'Link Back',
  icon: 'mdi:arrow-left-thick',

  block: {
    component: NavigationBack,
    props: {
      icon: null,
      text: '',
      subtext: '',
    },
  },

  editor: {
    actions: [
      {
        'title': 'Link options',
        'component': NavigationLinkEditor,
        'v-model': 'block',
      },
    ],
  },
}