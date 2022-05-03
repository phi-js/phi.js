import GoToEditor from './GoToEditor.vue'
import CallEditor from './CallEditor.vue'

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

  'Story.call': {
    icon: 'mdi:variable',
    text: 'Call function',
    tabs: ['navigation'],

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
}