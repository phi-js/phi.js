export default {
  name: 'Story.goNext',
  icon: 'mdi:arrow-right-thick',
  title: 'Go to next page',

  callback: function(pageId, _scope = null, _vm = null) {
    if (!_vm?.custom?.$nav) {
      console.warn('Story.goNext called without custom \'$nav\' object')
      return
    }
    _vm.custom.$nav.goNext()
  },
}