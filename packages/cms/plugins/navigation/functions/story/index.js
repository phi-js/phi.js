import GoToEditor from './GoToEditor.vue'
import CallEditor from './CallEditor.vue'

export default [
  {
    name: 'Story.goTo',
    icon: 'mdi:arrow-right-thick',
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
  },

  {
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
  },

  {
    name: 'Story.call',
    icon: 'mdi:variable',
    title: 'Call function',

    editor: {
      component: CallEditor,
      props: null,
    },

    callback: function(args = null, _scope = null, _vm = null) {
      if (!_vm?.custom?.story) {
        console.warn('Story.call called without custom \'story\' object')
        return
      }

      if (!_vm?.custom?.story?.sanitizedStory?.value?.methods?.length) {
        console.warn('Story.call Current story has no \'methods\'')
        return
      }

      if (!args?.fn) {
        console.warn('Story.call needs an \'fn\' argument')
        return
      }

      const availableMethods = _vm.custom.story.sanitizedStory.value.methods

      const foundMethod = availableMethods.find((m) => m.name == args.fn)
      if (!foundMethod) {
        console.warn(`Story.call: Method '${args.fn}' not found`)
        return
      }

      return _vm.eval(foundMethod.do, _scope)
    },
  },

  // Emit activity hook
  {
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
  },
]