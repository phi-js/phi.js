// Emit activity hook
export default {
  name: 'Story.emit',
  icon: 'mdi:arrow-top-right-thick',
  title: 'Emit event',

  callback: (args = null, _scope = null, _vm = null) => {
    if (!_vm?.custom?.story) {
      console.warn('Story.emit called without custom \'story\' object')
      return
    }

    if (!args?.name) {
      console.error('Story.emit: invalid args object.  Expected { name, data }, got:', args)
      return
    }

    _vm.custom.story.emitStoryEvent({
      name: args.name,
      data: args.data || _scope?.$event,
      block: _scope?.$block,
      bubbled: false,
    })
  },
}