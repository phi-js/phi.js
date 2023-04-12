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
    if (!_vm?.custom?.$nav) {
      console.warn('Story.goTo called without custom \'$nav\' object')
      return
    }
    _vm.custom.$nav.goTo(pageId)
  },
}