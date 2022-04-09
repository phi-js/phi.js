import GoToEditor from './GoToEditor.vue'

export default {
  'Story.goTo': {
    icon: 'mdi:arrow-right-thick',
    text: 'Go to page',
    tabs: ['navigation'],

    editor: {
      component: GoToEditor,
      props: null,
    },

    callback: function(pageId, _scope = null, _vm = null) {
      if (!_vm?.custom?.story) {
        console.warn('Story.goto called without custom \'story\' object')
        return
      }
      _vm.custom.story.goTo(pageId)
    },
  },

  'Story.goBack': {
    icon: 'mdi:arrow-left-thick',
    text: 'Go back',
    tabs: ['navigation'],

    callback: function(args = null, _scope = null, _vm = null) {
      if (!_vm?.custom?.story) {
        console.warn('Story.goBack called without custom \'story\' object')
        return
      }
      _vm.custom.story.goBack()
    },
  },
}