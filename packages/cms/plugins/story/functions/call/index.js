import CallEditor from './CallEditor.vue'

export default {
  name: 'Story.call',
  icon: 'mdi:variable',
  title: 'Call method',

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
}