export default {
  name: 'Story.goBack',
  icon: 'mdi:arrow-left-thick',
  title: 'Go back',

  callback: function(args = null, _scope = null, _vm = null) {
    if (!_vm?.custom?.$nav) {
      console.warn('Story.goBack called without custom \'$nav\' object')
      return
    }
    _vm.custom.$nav.goNext()
  },
}