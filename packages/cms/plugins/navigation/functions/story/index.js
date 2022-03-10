import PagePicker from './PagePicker.vue'

export default {
  'Story.goTo': {
    icon: 'mdi:arrow-right-thick',
    text: 'Go to page',
    editor: {
      component: PagePicker,
      props: null,
    },
  },

  'Story.goBack': {
    icon: 'mdi:arrow-left-thick',
    text: 'Go back',
  }
}