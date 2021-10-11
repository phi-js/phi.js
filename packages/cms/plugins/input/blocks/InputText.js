const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

export default {
  tags: ['input'],

  name: 'InputText',
  title: 'Text',
  icon: 'mdi:form-textbox',

  block: {
    'component': UiInput,
    'v-model': 'text',
    'props': { type: 'text' },
  },

  editor: {
    face: {
      'component': InputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Text',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}