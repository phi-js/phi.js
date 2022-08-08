export default {
  name: 'Story.goNext',
  icon: 'mdi:arrow-right-thick',
  title: 'Go to next page',

  callback: function(pageId, _scope = null, _vm = null) {
    if (!_vm?.custom?.story) {
      console.warn('Story.goto called without custom \'story\' object')
      return
    }
    return _vm.custom.story.goNext()
  },
}