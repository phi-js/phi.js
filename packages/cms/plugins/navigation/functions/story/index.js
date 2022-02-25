import Foo from './Foo.vue'

export default {
  'Story.goTo': {
    icon: 'mdi:arrow-right-thick',
    text: 'Go to page',
    editor: {
      component: Foo,
      props: null,
    },
  },

  'Story.goBack': {
    icon: 'mdi:arrow-left-thick',
    text: 'Go back',
  }
}