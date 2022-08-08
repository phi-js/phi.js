export default {
  name: 'Story.goBack',
  icon: 'mdi:arrow-left-thick',
  title: 'Go back',

  callback: function(args = null, _scope = null, _vm = null) {
    if (!_vm?.custom?.story) {
      console.warn('Story.goBack called without custom \'story\' object')
      return
    }
    _vm.custom.story.goBack()
  },
}