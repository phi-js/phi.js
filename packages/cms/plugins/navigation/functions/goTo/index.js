import GoToEditor from './GoToEditor.vue'

export default {
  name: 'Story.goTo',
  icon: 'mdi:file-find',
  title: 'Go to page',

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
}